# Myanmar Recipe Generator

This project is a web application that generates authentic Myanmar recipes based on user-selected ingredients. It features a modern UI with Tailwind CSS and Shadcn components, and integrates with a Cloudflare worker to generate images of the recipes.

## Features

- **Recipe Generation**: Create Myanmar recipes based on selected ingredients, meal type, duration, and servings.
- **Image Generation**: Automatically generate images of the recipes using a Cloudflare worker.
- **Modern UI**: Built with Tailwind CSS and Shadcn components for a sleek and responsive design.
- **Language Support**: Toggle between English and Myanmar for recipe instructions.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/myanmar-recipe-generator.git
   cd myanmar-recipe-generator
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Start the Production Server**:
   ```bash
   npm start
   ```

## Configuration

- **Cloudflare Worker**: Ensure the Cloudflare worker URL is correctly set in `src/services/imageGeneration.ts`.
- **Environment Variables**: Configure any necessary environment variables in a `.env` file.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. 