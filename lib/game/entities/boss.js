ig.module(
	'game.entities.boss'
)
.requires(
	'impact.entity',
	'game.entities.particleExplosion'
)
.defines(function(){
	
EntityBoss = ig.Entity.extend({
	size: {x: 50, y: 50},
	maxVel: {x: 100, y: 100},
	friction: {x: 0, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	health: 100,
	flip: false,
	
	damage: 2,
	xp: 10,
	health: 0,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.damage = this.damage*ig.global.difficulty;
		this.xp = this.xp*ig.global.xp;

		this.hurt = new ig.Sound( 'media/music/hurt.*' );
		this.hurt.volume = .2;
		this.kill();
	},
	
	receiveDamage: function( amount, from ) {
		// Add particle blood
		ig.game.spawnEntity( EntityParticleExplosion , this.pos.x, this.pos.y, {particleOffset: 1} );
		this.hurt.play();

		this.parent( amount, from );	
	},

	kill: function(){
		ig.game.spawnEntity( EntityXpDrop , this.pos.x, this.pos.y, {particles: this.xp} );
		this.parent();
	},

	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
			}
		},	
	
	check: function( other ) {
		other.receiveDamage( this.damage, this );

	}
});

});