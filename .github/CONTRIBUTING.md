# CONTRIBUTION GUIDELINES

## Set up development environment
1. **Install modules**:
    ```bash
    npm ci
    ```
2. **Start the development server**:
    ```bash
    npm run dev
    ```

3. **Load Unpacked Extension in Web Extension Developer Dashboard**:
    - Open the browser and navigate to the extension management page.
    - Enable developer mode.
    - Click on the "Load unpacked" button.
    - Select the `dist` directory in the project root.
    - The extension will be loaded into the browser.
4. **Hot Reload**:
   - When you edit and save files, the extension will automatically reload, allowing you to see your changes in real-time.

## How to release
1. **Update version in `package.json`**

2. **Build the project**: 
    ```bash
    npm run build
    ```

3. Zip the build:
    ```bash
    zip -r upload dist
    ```

4. **Upload the zip file (upload.zip) to the Web Extension Developer Dashboard**
