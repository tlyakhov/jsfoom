function MapSegment(options) {
	this.id = "Segment_" + (new ObjectId().toString());
	this.ax = 0.0;
	this.ay = 0.0;
	this.bx = 0.0;
	this.by = 0.0;	
	this.midTexSrc = 'data/bricks.png';
	this.midTex = null;
	this.loTexSrc = 'data/grate.jpg';
	this.loTex = null;
	this.hiTexSrc = 'data/grate.jpg';
	this.hiTex = null;
	this.length = 0;
	this.adjacentSectorId = null;
	this.adjacentSector = null;
	this.playerPortal = false;
	this.flags = 0;
	
	$.extend(true, this, options);

	this.update();
}

MapSegment.prototype.update = function() {
	this.length = Math.sqrt((this.ax - this.bx) * (this.ax - this.bx) + (this.ay - this.by) * (this.ay - this.by));
};

MapSegment.prototype.getMidTex = function() {
	if(!this.midTexSrc)
		return null;
		
	if(!this.midTex || this.midTex.src != this.midTexSrc)
		this.midTex = textureCache.get(this.midTexSrc, true);	
		
	return this.midTex;
};

MapSegment.prototype.getHiTex = function() {
	if(!this.hiTexSrc)
		return null;
		
	if(!this.hiTex || this.hiTex.src != this.hiTexSrc)
		this.hiTex = textureCache.get(this.hiTexSrc, true);	
		
	return this.hiTex;
};

MapSegment.prototype.getLoTex = function() {
	if(!this.loTexSrc)
		return null;
		
	if(!this.loTex || this.loTex.src != this.loTexSrc)
		this.loTex = textureCache.get(this.loTexSrc, true);	
		
	return this.loTex;
};

MapSegment.prototype.getAdjacentSector = function() {
	if(!this.adjacentSectorId)
		return null;
		
	if(!this.adjacentSector || this.adjacentSector.id != this.adjacentSectorId)
	{
		for(var i = 0; i < this.sector.map.sectors.length; i++)
		{
			var s = this.sector.map.sectors[i];
			if(this.adjacentSectorId == s.id)
			{
				this.adjacentSector = s;
				break;
			}
		}
	}
	
	return this.adjacentSector;
};

MapSegment.prototype.intersect = function(s2) {
	var denom = -1.0;
	var r = -1.0;
	var s = -1.0;
	var s1 = this;
	var s1dx = s1.bx - s1.ax;
	var s1dy = s1.by - s1.ay;
	var s2dx = s2.bx - s2.ax;
	var s2dy = s2.by - s2.ay;
	
	denom = s1dx * s2dy - s2dx * s1dy;			
	if (denom == 0)
		return undefined;
	r = (s1.ay - s2.ay) * s2dx - (s1.ax - s2.ax) * s2dy;			
	if (denom <= 0 && r >= 0)
		return undefined;
	if (denom > 0 && r < 0)
		return undefined;
	s = (s1.ay - s2.ay) * s1dx - (s1.ax - s2.ax) * s1dy;	
	if (denom <= 0 && s >= 0)
		return undefined;
	if(denom > 0 && s < 0)
		return undefined;
	r /= denom;
	s /= denom;
	if (r > 1.0 || s > 1.0)
		return undefined;
		
	return { x: s1.ax + r * s1dx, y: s1.ay + r * s1dy, tx: r };
};

function Ray(ax, ay, bx, by) {
	this.ax = ax;
	this.ay = ay;
	this.bx = bx;
	this.by = by;
}

Ray.prototype.intersect = MapSegment.prototype.intersect;