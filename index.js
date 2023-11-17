const mineflayer = require('mineflayer');
const express = require('express');
const Movements = require('mineflayer-pathfinder').Movements;
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const { GoalBlock } = require('mineflayer-pathfinder').goals;
const { Vec3 } = require('vec3');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const mcData = require('minecraft-data')("1.20.1");

const blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);

const config = require('./settings.json');
const loggers = require('./logger.js');
const logger = loggers.logger;
const app = express();

app.get('/', (req, res) => {
  res.send('Your Bot Is Ready! Subscribe My Youtube: <a href="https://youtube.com/@H2N_OFFICIAL?si=UOLwjqUv-C1mWkn4">H2N OFFICIAL</a>')
});
app.listen(4000);

function createBot() {
  const bot = mineflayer.createBot({
    username: config.bot.username,
    password: config.bot.password,
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version,
  });

  //Loading Plugins
  bot.loadPlugin(pathfinder);
  bot.loadPlugin(blockFinderPlugin);
  const defaultMove = new Movements(bot, mcData);
  bot.movement = defaultMove;

  bot.once('spawn', () => {
    mineflayerViewer(bot, { port: 3001, firstPerson: true });
    logger.info("Bot joined to the server");
  });

  bot.on('chat', (username, message) => {
    const tokens = message.split(' ');
    if (message === 'sa') {
      bot.chat('as');
    }
    if (tokens[0] === 'startMining') {
      if (tokens.length !== 6) {
        bot.chat('Usage: startMining <startPoint:x> <startPoint:y> <startPoint:z> <mineBlocksRow> <mineBlocksCoulmn>');
        return;
      }
  
      const startPoints = {
        x: parseInt(tokens[1]),
        y: parseInt(tokens[2]),
        z: parseInt(tokens[3])
      };
  
      const mineBlocksRow = parseInt(tokens[4]);
      const mineBlocksCoulmn = parseInt(tokens[5]);
  
      startMining(bot, startPoints, mineBlocksRow, mineBlocksCoulmn);
    }
  });

async function mineOre(bot, row, column, startPoints) {
  const { x, y, z } = startPoints;
  
  if (isInventoryFull(bot)) {
    await bot.pathfinder.goto(new GoalBlock(x, y, z));
    await dropItems(bot);
  }

  const oreTypes = [
    mcData.blocksByName.deepslate_redstone_ore.id,
    mcData.blocksByName.deepslate_lapis_ore.id,
    mcData.blocksByName.deepslate_diamond_ore.id,
    mcData.blocksByName.deepslate_emerald_ore.id,
    mcData.blocksByName.deepslate_coal_ore.id,
  ];
  
  const blocks = oreTypes.reduce((result, oreType) => {
    const oreBlocks = bot.findBlocks({
      matching: oreType,
      maxDistance: 2.2,
      count: 20,
      maxEntities: 10,
      algorithm: 'manhattan',
      point: bot.entity.position
    });
    return result.concat(oreBlocks);
  }, []);

  if (blocks.length !== 0) {
    for (const block of blocks) {
      const blockBelow = bot.blockAt(new Vec3(block.x, block.y - 1, block.z));
      const blockAbove = bot.blockAt(new Vec3(block.x, block.y + 1, block.z));
      const blockToDig = bot.blockAt(block);

      if (blockBelow && blockBelow.type === 0 && blockBelow.name === "bedrock" || blockAbove.name === 'bedrock') {
        await bot.dig(blockToDig);
      } else {
        await bot.pathfinder.goto(new GoalBlock(block.x, block.y, block.z));
      }
    }
    await mineOre(bot, row, column,startPoints);
  } else {
    const goalBlock = bot.blockAt(new Vec3(x + row, y - 1, z + column));
    if (!goalBlock) {
      await bot.equip(bot.inventory.items().find(item => item.name == "cobbled_deepslate"), 'hand');
      await bot.pathfinder.goto(new GoalBlock(x + row - 1, y, z + column));
      try {
        await bot.placeBlock(goalBlock, new Vec3(0, 0.5, 0));
      } catch (err) {
        console.log(err);
      }
    }
    await bot.pathfinder.goto(new GoalBlock(x + row, y, z + column));
  }
}

    async function startMining(bot, startPoints, mineBlocksRow, mineBlocksCoulmn) {
      const { x, y, z } = startPoints;
  
      await bot.pathfinder.goto(new GoalBlock(x, y, z));

      for (let column = 0; column <= mineBlocksCoulmn * 3; column += 3) {
        await bot.pathfinder.goto(new GoalBlock(x, y, z + column));
        for (let row = 0; row <= mineBlocksRow; row++) {
          const thereIsLava = isThereLava(bot);
          if(!thereIsLava) {
            column +=3;
            row += 0;
          }
          if (row % 10 === 0) {
            await placeTorch(bot);
          }
          await mineOre(bot, row, column,startPoints);
        }
      }

      bot.chat('Mining Done!');
  }
}

async function isThereLava(bot) {
  const blocksLava = bot.findBlocks({
    matching: mcData.blocksByName.lava.id,
    maxDistance: 2, // Set an appropriate value for the maximum distance to search
    maxEntities: 10, // Limit the search to only blocks (ignore entities)
    point: bot.entity.position // Set the point from which to start searching (bot's position)
  });
  return blocksLava.length > 0;
}

function isInventoryFull(bot) {
  const botInventory = bot.inventory;
  const occupiedSlots = botInventory.slots.filter(item => item !== null).length;
  const maxSlots = botInventory.inventoryEnd - botInventory.inventoryStart

  return occupiedSlots === maxSlots;
}

async function isChestFull(bot,chest){
  const chestBlock = bot.blockAt(chest);
  const currentChest = await bot.openChest(chestBlock);
  const chestInventory = currentChest.containerItems();
  const occupiedSlots = chestInventory.filter(item => item !== null).length;
  const maxSlots = chestInventory.length;
  await currentChest.close();
  return occupiedSlots === maxSlots;
}

function isTool(item) {
  return item.stackSize === 1;
}

function itemByName (items, name) {
  let item
  let i
  for (i = 0; i < items.length; ++i) {
    item = items[i]
    if (item && item.name === name) return item
  }
  return null
}

async function depositItem (name, amount,chest) {
  const item = itemByName(chest.items(), name)
  if (item) {
    try {
      await chest.deposit(item.type, null, amount)
      console.log(item.type, amount);
    } catch (err) {
      logger.error(err);
    }
  }
}


async function dropItems(bot) {
  const chests = bot.findBlocks({
    matching: mcData.blocksByName.chest.id,
    maxDistance: 5,
  });

  if (chests.length === 0) {
    bot.chat("I need a chest nearby to drop items!");
    setTimeout(() => {
      dropItems(bot);
    }, 5000);
  } else {
    for (const chest of chests) {
      if (!await isChestFull(bot,chest)) continue;

      const chestBlock = bot.blockAt(chest);
      const currentChest = await bot.openChest(chestBlock);
      const botInventory = bot.inventory.items();

      for (const item of botInventory) {
        if (item && !isTool(item)){
           await depositItem(item.name, item.count, currentChest);
        }
      }
    }
  }

  logger.info("Dropped items");
}

async function placeTorch(bot) {
  const torchItem = bot.inventory.items().find(item => item.name === 'torch'); // Adjust the name according to your Minecraft version
  if (torchItem) {
    const torchBlock = bot.blockAt(bot.entity.position.offset(0, -1, 0)); // Place the torch one block below the bot's current position
    await bot.equip(torchItem, 'hand');
    await bot.placeBlock(torchBlock, new Vec3(0, 1, 0)); // Place the torch above the block below the bot
  } else {
    console.log('No torches in inventory');
  }
}

createBot();
