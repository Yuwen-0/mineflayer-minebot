# Minecraft Mining Bot

This repository contains a Minecraft bot programmed in JavaScript using Mineflayer to automate mining tasks in the game.

## Setup

### Prerequisites

- Node.js installed ([Download Node.js](https://nodejs.org/))
- Minecraft Java Edition installed

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/minecraft-mining-bot.git
    ```

2. Navigate to the project directory:

    ```bash
    cd minecraft-mining-bot
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Update `settings.json`:

    - Open `settings.json` and fill in the necessary server IP, port, bot username, and other configuration details.

### Usage

1. Start the bot:

    ```bash
    npm start
    ```

2. In Minecraft, ensure the server is running and take bot to the place you want it to start mineing at.

3. To activate the bot, use the following command in the Minecraft chat:

    ```
    startMining <startPoint:x> <startPoint:y> <startPoint:z> <mineBlocksRow> <mineBlocksColumn>
    ```

    Replace `<startPoint:x>`, `<startPoint:y>`, `<startPoint:z>`, `<mineBlocksRow>`, and `<mineBlocksColumn>` with the desired starting coordinates and dimensions for mining.

## Features

- Automatic mining of various ores
- Torch placement for illumination during mining
- Inventory management (dropping items, storing in chests)
- Handling of obstacles such as lava, water, and gravel

## Configuration

- Modify `settings.json` to adjust bot credentials, server details, and behavior settings.

## Dependencies

- `mineflayer`: JavaScript library for creating Minecraft bots
- `mineflayer-pathfinder`: Pathfinding plugin for Mineflayer bots
- `prismarine-viewer`: Viewer for visualizing the bot's activities in a browser

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

This project is licensed under the [GNU License](LICENSE).
