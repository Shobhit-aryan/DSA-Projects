let config = {
    type: Phaser.AUTO,

    scale: {
        mode: Phaser.Scale.FIT,
        width: 1222,
        height: 600,
    },

    backgroundColor: 0xffff11,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000,
            },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

let game = new Phaser.Game(config);

let player_config = {
    player_speed : 150,
    player_jumpspeed : -650,
}
function preload() {
    this.load.image("ground", "assets/topground.png");
    this.load.image("sky", "assets/background.png");
    this.load.spritesheet("dude", "assets/dude.png", { frameWidth: 32, frameHeight: 48 });
    this.load.image("apple","assets/apple.png");
    this.load.image("ray", "assets/ray.png");
}

function create() {
    W = game.config.width;
    H = game.config.height;

    let background = this.add.tileSprite(0, 0, W, H, 'sky');
    background.setOrigin(0, 0);

    let ground = this.add.tileSprite(0, H - 128, W, 128, 'ground');
    ground.setOrigin(0, 0);

    let rays = [];
    
    for(let i=-10;i<=10;i++){
        let ray = this.add.sprite(W/2,H-100,'ray');
        ray.displayHeight = 1.2*H;
        ray.setOrigin(0.5,1);
        ray.alpha = 0.2;
        ray.angle = i*20;
        ray.depth = -1;
        rays.push(ray);
    }
    
 
    this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=20"
            },
        },
        duration : 8000,
        repeat : -1
    });
    



    this.player = this.physics.add.sprite(100, 100, 'dude', 4);
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);


    this.anims.create({
        key:'left',
        frames: this.anims.generateFrameNumbers('dude', {start:0, end:3}),
        frameRate : 10,
        repeat: -1

    });
    this.anims.create({
        key:'center',
        frames: [{key:'dude', frame:4}],
        
    });
    this.anims.create({
        key:'right',
        frames: this.anims.generateFrameNumbers('dude', {start:5, end:8}),
        frameRate : 10,
        repeat: -1
    });

   


    this.cursors = this.input.keyboard.createCursorKeys();

    let fruits = this.physics.add.group({
        key: "apple",
        repeat: 15,
        setScale: {x:0.2,y:0.2},
        setXY: { x: 10, y: 0, stepX: 100 },
    });

    fruits.children.iterate(function(f){
        f.setBounce(Phaser.Math.FloatBetween(0.4, 0.7));
    });
    this.physics.add.existing(ground, true);
    //ground.body.allowGravity = false;
    //ground.body.immovable = true;

    let platforms = this.physics.add.staticGroup();
    platforms.create(100, 200, 'ground').setScale(2,0.5).refreshBody();
    platforms.create(700, 200, 'ground').setScale(2,0.5).refreshBody();
    platforms.create(500, 350, 'ground').setScale(2,0.5).refreshBody();
    platforms.create(1050, 350, 'ground').setScale(2,0.5).refreshBody();


    this.physics.add.collider(ground, this.player);
    this.physics.add.collider(ground, fruits);
    this.physics.add.collider(platforms, fruits);
    this.physics.add.collider(platforms,this.player);
    this.physics.add.overlap(this.player, fruits,eatFruit, null, this);

    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    this.cameras.main.startFollow(this.player, true, true);
    this.cameras.main.setZoom(1.5);
}

function eatFruit(player, fruit){
    fruit.disableBody(true, true);
}

function update() {
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left', true);
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right', true);

    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play('center');

    }

    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jumpspeed);
    }
    
}