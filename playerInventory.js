class PlayerInventory extends Inventory
{
	constructor()
	{
		super();
		if (!PlayerInventory.instance)
		{
			PlayerInventory.instance = this;
		}
		return PlayerInventory.instance;
	}

	static printData()
	{
		const inventory = new PlayerInventory();
		console.log('PlayerInventory:\t\n%o', inventory);
	}

	showHideInventory (scene, player) {
		if (scene.inventory.visible) {
			scene.inventory.visible = false;
			player.body.enable = true;
		} else {
			scene.inventory.visible = true;
			player.body.enable = false;
		}
	}

	drawGroup (scene)
	{
		// We the a group if we are drawing or erasing the inventory...
		let inventoryGroup = scene.inventoryGroup || scene.add.group();
		scene.inventoryGroup = inventoryGroup;
		return inventoryGroup;
	}

	drawInventory (scene, player, inventoryGroup)
	{
		player.visualSlots = player.visualSlots || [];
		let makeSlot = function (scene, player) {
			/*
			let inventory = new PlayerInventory();
			const numSlots = inventory.getSize();
			const slotsPerColumn = 5; // const slotsPerColumn = parseInt((numSlots * 0.25).toFixed(0)); */
			// let inventory = new PlayerInventory();
			const numSlots = player.visualSlots.length;
			let column = 0;
			for (let i = numSlots; i > 0; i--) {
				if (i % 5 === 0) {
					column = column + 1;
				}
			}
			const slotWidth = Dims.gridSize;
			const slotHeight = Dims.gridSize;
			const x = (numSlots % 5) * (Dims.padding * 0.5 + slotWidth) + player.x - Dims.padding * 11;
			const y = column * (Dims.padding * 0.5 + slotHeight) + player.y - Dims.padding * 6.5;

			let slot = scene.add.rectangle(x, y, slotWidth, slotHeight, 0xFFFFFF, 0.75);
			slot.setOrigin(0, 0);
			// let slotText = scene.add.text(slot.x, slot.y, 'S ' + numSlots, {fontSize: '16px', fill: '#000'});
			return slot;
		}

		// draw the inventory
		let alpha = 0.80;
		let bg = scene.add.rectangle(player.x, player.y, 384, 240, 0x000000, alpha);
		const inventory = new PlayerInventory();
		const invLength = inventory.getInventory().length;
		for (let i = 0; i < invLength; i++) {
			let slot = makeSlot(scene, player);
			inventoryGroup.add(slot);
			player.visualSlots.push(slot);
			let item = inventory.getInventory()[i];
			if (item && item.artKey) {
				let sprite = scene.add.image(slot.x + Dims.padding * 0.5, slot.y + Dims.padding * 0.5, item.artKey);
				sprite.setOrigin(0, 0);
				sprite.setScale( (Dims.gridSize - Dims.padding) / Math.max(sprite.width, sprite.height));
				sprite.setInteractive();
				sprite.on('pointerdown', function (pointer, x, y, event) {
					console.log('clicked %o', pointer);
					player.itemSelected = sprite;
				});
				scene.input.on('gameobjectdown', function (pointer, gameObject)
				{
					console.log('clicked %o', gameObject);
				});

				inventoryGroup.add(sprite);
			}
			if (item && item.name) {
				const bgHeight = Dims.padding * 1.5;
				let textBG = scene.add.rectangle(slot.x, slot.y + slot.height - bgHeight, slot.width, bgHeight, 0x000000, 0.75);
				textBG.setOrigin(0, 0);
				let text = scene.add.text(textBG.x + Dims.padding * 0.5, textBG.y + Dims.padding * 0.5, item.name, {fontSize: '16px', fill: '#FFFFFF'});
				text.setOrigin(0, 0);
				inventoryGroup.add(textBG);
				inventoryGroup.add(text);
			}
		}
		inventoryGroup.add(bg);
		scene.inventoryGroup = inventoryGroup;
	}

	eraseInventory (scene, player, inventoryGroup)
	{
		player.visualSlots = player.visualSlots || [];

		// erase the inventory
		scene.inventoryGroup = null;
		inventoryGroup.clear(true, true);
		inventoryGroup.destroy();
		player.visualSlots.forEach(function (slot) {
			slot.destroy();
			scene.input.removeAllListeners('gameobjectdown');
		});
		player.visualSlots = [];
	}

	startTracking(scene, player)
	{
		// Inventory Opened / Closed
		scene.input.keyboard.on('keydown-E', function (event) {
			let inventory = new PlayerInventory();
			inventory.showHideInventory(scene, player);
			let inventoryGroup = inventory.drawGroup(scene);
			if (scene.inventory.visible) {
				inventory.drawInventory(scene, player, inventoryGroup);
			} else {
				inventory.eraseInventory(scene, player, inventoryGroup);
			}
		}, scene);

		// Inventory Swapping when drag and drop

		// Inventory Split stack

		// Inventory take one item from stack

		// Inventory drop selected

		// Inventory use selected

		// Inventory destroy selected
	}

	getSizeCurrent()
	{
		this.items = this.items || [];
		return this.items.length;
	}

	swapItems(item1, item2)
	{
		// instantiate the inventory if it doesn't exist
		this.items = this.items || [];
		const index1 = this.items.indexOf(item1);
		const index2 = this.items.indexOf(item2);
		if (index1 === -1 || index2 === -1)
		{
			return false;
		}
		this.items[index1] = item2;
		this.items[index2] = item1;
		return this.getInventory();

	}

	getInventory()
	{
		this.items = this.items || [];
		return this.items;
	}

	addItem(item)
	{
		// instantiate the inventory if it doesn't exist
		this.items = this.items || [];
		this.items.push(item);
		return this.getInventory();
	}

	removeItem(item)
	{
		// instantiate the inventory if it doesn't exist
		this.items = this.items || [];
		this.items = this.items.filter(function (i) {
			return i !== item;
		});
		return this.getInventory();
	}
}