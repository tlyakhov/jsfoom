function fast_floor(v)
{
	return v | 0;
}

function normalizeAngle(a)
{
	var result = a;
	
	while(result < 0)
	{
		result += 360.0;			
	}
	while(result >= 360.0)
	{
		result -= 360.0;
	}
	return result;
}

var deg2rad = Math.PI / 180.0;