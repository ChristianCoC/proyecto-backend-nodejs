// ============================================
// CONSTANTES
// ============================================
const API_BASE = "https://fakestoreapi.com/products";

const MESSAGES = {
  usage: [
    "Usage: node index.js GET products",
    "Usage: node index.js GET product <id>",
    "Usage: node index.js POST products <title> <price> <category>",
    "Usage: node index.js DELETE products/<id>",
  ],
  errors: {
    fetch: (action) => `Error ${action}:`,
    noArgs: "No arguments provided",
    invalidCommand: "Invalid command",
  },
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function extractIdFromPath(path) {
  const id = path.split("/")[1];
  return isNaN(id) ? null : id;
}

function showUsageAndExit() {
  MESSAGES.usage.forEach(msg => console.log(msg));
  process.exit(1);
}

function handleError(error, action) {
  console.error(MESSAGES.errors.fetch(action), error);
  process.exit(1);
}

async function apiFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
}

// ============================================
// VALIDACION DE ARGUMENTOS DE LA CONSOLA
// ============================================

function isValidGetAllProducts(args) {
  return args.length === 2 && args[0] === "GET" && args[1] === "products";
}

function isValidGetProductById(args) {
  return (
    (args.length === 3 && args[0] === "GET" && args[1] === "product" && !isNaN(args[2])) ||
    (args.length === 2 && args[0] === "GET" && args[1].includes("products/") && extractIdFromPath(args[1]))
  );
}

function isValidCreateProduct(args) {
  return (
    args.length === 5 &&
    args[0] === "POST" &&
    args[1] === "products" &&
    args[2] &&
    !isNaN(args[3]) &&
    args[4]
  );
}

function isValidDeleteProduct(args) {
  return (
    args.length === 2 &&
    args[0] === "DELETE" &&
    args[1].includes("products/") &&
    extractIdFromPath(args[1])
  );
}

// ============================================
// FUNCIONES DE INTERACCIÓN CON LA API
// ============================================

async function getProducts() {
  try {
    const data = await apiFetch(API_BASE);
    return data;
  } catch (error) {
    handleError(error, "fetching products");
  }
}

async function getProductById(id) {
  try {
    const data = await apiFetch(`${API_BASE}/${id}`);
    return data;
  } catch (error) {
    handleError(error, "fetching product by ID");
  }
}

async function createProduct(params) {
  try {
    const data = await apiFetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return data;
  } catch (error) {
    handleError(error, "creating product");
  }
}

async function deleteProductById(id) {
  try {
    const data = await apiFetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    return data;
  } catch (error) {
    handleError(error, "deleting product");
  }
}

// ============================================
// COMANDOS DE LA CONSOLA
// ============================================

async function handleGetAllProducts() {
  const products = await getProducts();
  console.log("Products:", products);
}

async function handleGetProductById(args) {
  const id = args.length === 3 ? args[2] : extractIdFromPath(args[1]);
  const product = await getProductById(id);
  console.log("Product:", product);
}

async function handleCreateProduct(args) {
  const product = await createProduct({
    title: args[2],
    price: parseFloat(args[3]),
    category: args[4],
  });
  console.log("Created product:", product);
}

async function handleDeleteProduct(args) {
  const id = extractIdFromPath(args[1]);
  const deletedProduct = await deleteProductById(id);
  console.log("Deleted product:", deletedProduct);
}

// ============================================
// FUNCION PRINCIPAL
// ============================================

async function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    showUsageAndExit();
  }

  if (isValidGetAllProducts(args)) {
    await handleGetAllProducts();
  } else if (isValidGetProductById(args)) {
    await handleGetProductById(args);
  } else if (isValidCreateProduct(args)) {
    await handleCreateProduct(args);
  } else if (isValidDeleteProduct(args)) {
    await handleDeleteProduct(args);
  } else {
    showUsageAndExit();
  }
}

main();
