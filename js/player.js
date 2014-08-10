Player.prototype = new Entity();
Player.prototype.constructor = Player;
Player.prototype.parent = Entity.prototype;

function Player(options)
{
	this.parent.constructor.call(this, options);
	
	this.height = 32;
	this.x = this.map.spawnx;
	this.y = this.map.spawny;
	
	$.extend(true, this, options);
	this.updateSector();
}

Player.prototype.frame = function(lastFrameTime)
{
	this.velX /= 4.0;
	this.velY /= 4.0;
	if(this.z > this.sector.bottomZ)
	{
		this.velZ -= 0.1;
	}
	else if(this.z < this.sector.bottomZ)
	{
		this.velZ = 0;
		this.z = this.sector.bottomZ;
	}
	
	this.parent.frame.call(this, lastFrameTime);
	this.updateSector();
}

Player.prototype.move = function(angle, lastFrameTime)
{
	var speed = 4.0;
	
	var opx = this.x;
	var opy = this.y;
	
	this.velX += Math.cos(angle * deg2rad) * speed;
	
	this.x += this.velX * lastFrameTime / 10.0;
	this.y += this.velY * lastFrameTime / 10.0;
	
	if(!this.updateSector())
	{
		this.velX = 0;
	}
	
	this.velY += Math.sin(angle * deg2rad) * speed;
	
	this.x = opx + this.velX * lastFrameTime / 10.0;
	this.y = opy + this.velY * lastFrameTime / 10.0;
	
	if(!this.updateSector())
	{
		this.velY = 0;
	}
	
	this.x = opx;
	this.y = opy;
}