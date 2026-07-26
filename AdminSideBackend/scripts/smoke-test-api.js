const http = require("http");

const BASE = "http://127.0.0.1:5000";

function request(method, urlPath, { token, body, formBoundary, rawBody } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE);
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    let payload = null;
    if (rawBody) {
      payload = rawBody;
      headers["Content-Type"] = `multipart/form-data; boundary=${formBoundary}`;
      headers["Content-Length"] = Buffer.byteLength(payload);
    } else if (body !== undefined) {
      payload = Buffer.from(JSON.stringify(body));
      headers["Content-Type"] = "application/json";
      headers["Content-Length"] = payload.length;
    }

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method,
        headers,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          let json = null;
          try {
            json = JSON.parse(text);
          } catch {
            // ignore
          }
          resolve({ status: res.statusCode, json, text: text.slice(0, 400) });
        });
      }
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function multipart(fields, files) {
  const boundary = `----OzvenTest${Date.now()}`;
  const parts = [];

  for (const [key, value] of Object.entries(fields)) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
    );
  }

  for (const file of files) {
    parts.push(
      `--${boundary}\r\nContent-Disposition: form-data; name="${file.name}"; filename="${file.filename}"\r\nContent-Type: ${file.contentType}\r\n\r\n`
    );
    parts.push(file.buffer);
    parts.push("\r\n");
  }

  parts.push(`--${boundary}--\r\n`);

  return {
    boundary,
    body: Buffer.concat(parts.map((part) => (Buffer.isBuffer(part) ? part : Buffer.from(part)))),
  };
}

async function main() {
  const results = [];
  const check = (name, ok, detail = "") => {
    results.push({ name, ok, detail });
    console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`);
  };

  const health = await request("GET", "/health");
  check("GET /health", health.status === 200 && health.json?.status === "ok", `status=${health.status}`);

  const login = await request("POST", "/api/auth/login", {
    body: { email: "admin@example.com", password: "Admin@123" },
  });
  const token = login.json?.token || login.json?.accessToken || login.json?.data?.token;
  check("POST /api/auth/login", login.status === 200 && Boolean(token), `status=${login.status}`);
  if (!token) {
    console.log(login.text);
    process.exit(1);
  }

  const profile = await request("GET", "/api/auth/profile", { token });
  check("GET /api/auth/profile", profile.status === 200, `status=${profile.status}`);

  const dash = await request("GET", "/api/dashboard", { token });
  check("GET /api/dashboard", dash.status === 200, `status=${dash.status}`);

  const cats = await request("GET", "/api/categories?page=1&limit=10", { token });
  check(
    "GET /api/categories",
    cats.status === 200 && Array.isArray(cats.json?.categories),
    `status=${cats.status}`
  );

  const createCat = await request("POST", "/api/categories", {
    token,
    body: { name: `Vercel Test Cat ${Date.now()}` },
  });
  const catId = createCat.json?.category?.id;
  check("POST /api/categories", createCat.status === 201 && Boolean(catId), `status=${createCat.status}`);

  const createSub = await request("POST", `/api/categories/${catId}/subcategories`, {
    token,
    body: { name: `Vercel Sub ${Date.now()}` },
  });
  let subcategoryId =
    createSub.json?.subcategory?.id ||
    createSub.json?.category?.subcategories?.slice(-1)?.[0]?.id;
  check(
    "POST /api/categories/:id/subcategories",
    createSub.status === 201 || createSub.status === 200,
    `status=${createSub.status}`
  );

  if (!subcategoryId) {
    const one = await request("GET", `/api/categories/${catId}`, { token });
    subcategoryId = one.json?.category?.subcategories?.[0]?.id;
  }

  const products = await request("GET", "/api/products?page=1&limit=5", { token });
  check("GET /api/products", products.status === 200, `status=${products.status}`);

  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64"
  );
  const mp = multipart(
    {
      name: `Vercel Product ${Date.now()}`,
      description: "upload test",
      status: "ACTIVE",
      subcategoryId: subcategoryId || "",
    },
    [{ name: "images", filename: "dot.png", contentType: "image/png", buffer: png }]
  );
  const createProd = await request("POST", "/api/products", {
    token,
    formBoundary: mp.boundary,
    rawBody: mp.body,
  });
  const productId = createProd.json?.product?.id;
  check(
    "POST /api/products + Cloudinary image",
    createProd.status === 201 && Boolean(productId),
    `status=${createProd.status} msg=${createProd.json?.message || ""}`
  );

  if (productId) {
    const getProd = await request("GET", `/api/products/${productId}`, { token });
    check("GET /api/products/:id", getProd.status === 200, `status=${getProd.status}`);

    const delProd = await request("DELETE", `/api/products/${productId}`, { token });
    check("DELETE /api/products/:id", delProd.status === 200, `status=${delProd.status}`);
  }

  const quotes = await request("GET", "/api/quotes?page=1&limit=5", { token });
  check("GET /api/quotes", quotes.status === 200, `status=${quotes.status}`);

  const createQuote = await request("POST", "/api/quotes", {
    body: {
      name: "Test User",
      email: "test@example.com",
      phone: "1234567890",
      company: "Acme",
      productName: "Box",
      quantity: "100",
      message: "hi",
    },
  });
  check(
    "POST /api/quotes",
    createQuote.status < 500,
    `status=${createQuote.status} ${createQuote.json?.message || ""}`
  );

  if (catId) {
    const delCat = await request("DELETE", `/api/categories/${catId}`, { token });
    check(
      "DELETE /api/categories/:id",
      delCat.status === 200 || delCat.status === 400 || delCat.status === 409,
      `status=${delCat.status}`
    );
  }

  const failed = results.filter((result) => !result.ok);
  console.log("---");
  console.log(`Passed: ${results.filter((result) => result.ok).length}/${results.length}`);
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
