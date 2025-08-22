# Project thinking of cloud drive project inspired from google drive and dropbox

* first we need to setup the basic react project- using vite..
* then we need to setup the tailwind.

## (1) Tailwind setup using vite

* now to setup the tailwind follow these steps

* ### step 1 => Create your project

  * this is either done when we creata a simple react project using vite.

    ```bash
    npm create vite@latest my-project
    cd my-project
    ```

* ### step 2 => Install Tailwind CSS

  * after this we need to install tailwind css

    ```bash
    npm install tailwindcss @tailwindcss/vite
    ```

* ### step 3 => Configure the Vite plugin

  * after this we need to configure the vite pulugin.js/ts file

    ```js
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'

    import tailwindcss from '@tailwindcss/vite' // importing tainwindcss

    // https://vite.dev/config/
    export default defineConfig({
        plugins: [
            react(),
            tailwindcss(), // set the tailwind plugin
        ],
    })
    ```

* ### step 4 => Import Tailwind CSS

  * import tailwind in the index.css file

    ```js
    @import "tailwindcss";
    ```

* ### step 5 => Start using Tailwind

  * now we can use the tailwind css.

    ```jsx

    import './App.css'
    function App() {
        return (
            <>
                <h1 className='bg-amber-300 m-10 text-center text-xl'>this is setup to test the tailwind</h1>
            </>
        )
    }
    export default App
    ```

---
