async function getProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    process.exit(1);
  }
}

async function getProductById(id) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    process.exit(1);
  }
}

async function createProduct(params) {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    process.exit(1);
  }
}

async function deleteProductById(id) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    console.log("Usage: node index.js GET products");
    process.exit(1);
  } else if (args.length === 2 && args[0] === "GET" && args[1] === "products") {
    const products = await getProducts();
    console.log("Products:", products);
  } else if (
    args.length === 3 &&
    args[0] === "GET" &&
    args[1] === "product" &&
    !isNaN(args[2])
  ) {
    const product = await getProductById(args[2]);
    console.log("Product:", product);
  } else if (
    args.length === 2 &&
    args[0] === "GET" &&
    args[1].includes("products/") &&
    !isNaN(args[1].split("/")[1])
  ) {
    const id = args[1].split("/")[1];
    const product = await getProductById(id);
    console.log("Product:", product);
  } else if (args.length === 5 && args[0] === "POST" && args[1] === "products" && args[2] && !isNaN(args[3]) && args[4]) {
    const product = await createProduct({
      title: args[2],
      price: parseFloat(args[3]),
      category: args[4],
    });
    console.log("Created product:", product);
  } else if (args.length === 2 && args[0] === "DELETE" && args[1].includes("products/") && !isNaN(args[1].split("/")[1])) {
    const id = args[1].split("/")[1];
    const deletedProduct = await deleteProductById(id);
    console.log("Deleted product:", deletedProduct);
  }
   else {
    console.log("Usage: node index.js GET products");
    console.log("Usage: node index.js GET product <id>");
    console.log("Usage: node index.js POST products title <price> <category>");
    console.log("Usage: node index.js DELETE products/<id>");
    process.exit(1);
  }
}

main();
