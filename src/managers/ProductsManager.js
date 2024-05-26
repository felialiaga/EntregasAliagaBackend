import fs from 'fs';

class ProductsManager {

    constructor() {
        this.path = './files/products.json';
        this.init();
    }

    async init() {
        if(fs.existsSync(this.path)) {
            console.log('Archivo products encontrado');
        } else {
            try {
                await fs.promises.writeFile(this.path, JSON.stringify([]));
                console.log('Archivo creado con exito!');
            } catch(error) {
                console.log(`Ocurrio el siguiente error: ${error}`);
                process.exit(1);
            }
        }
    }

    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, 'utf-8');
            return JSON.parse(products);
        } catch(error) {
            console.log('Ocurrio un error: ' + error);
            return null;
        }
    }

    async saveProducts(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
        } catch(error) {
            console.log(`Couldn't save product: ${error}`);
        }
    }

    async createProduct({title, description, code, price, status, stock, category}) {

        const newProduct = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category
        }

        const products = await this.getProducts();

        if (products.length === 0) {
            newProduct.id = 1;
        } else {
            newProduct.id = products[products.length - 1].id + 1;
        }

        products.push(newProduct);

       await this.saveProducts(products);

        return newProduct.id;

    }

}

export default ProductsManager;