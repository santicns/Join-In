//===============================================================
//	A Base class for an Joint to be derived from.
//
//
//
//
//
//===============================================================
function Joint(  ){

	this._accel = new THREE.Vector3();			// Usually Gravity if ignoring external force.
	this._velocity = new THREE.Vector3();		// Velocity vector.
	this._direction = new THREE.Vector3();		// Direction vector, maybe use a quaternion.
	
		// Set up the sphere vars
	var radius = 10, segments = 10, rings = 10;
	this._Material = new THREE.MeshLambertMaterial( {color: 0x000000 });
	this._Geometry = new THREE.SphereGeometry( radius, segments, rings );
	
	this._mesh = new THREE.Mesh( this._Geometry , this._Material );					// The mesh of the Joint. Contains physical properties.
	
	scene.add( this._mesh );													// Add ourself to the scene.
}



//===============================================================
//
//
//===============================================================
Joint.prototype.Move = function( dt ){

	// New position. S = U + T + 1/2 x A x (TxT)
	this._pos = this._pos + this._velocity + dt + 0.5 * this._accel * ( dt * dt );
	
	// New Veloctiy. V = U + A x T
	this._velocity = this._velocity + this._accel * dt;
	
	// Calculate the accleration of the Joint.
	CalcualteAccel();
	
	Render();
};



//===============================================================
//
//
//===============================================================
Joint.prototype.CalcualteAccel = function( extForce, gravity){

	this._accel = gravity + extForce;
};



//===============================================================
//	Probably won't be used as the scene renders it.
//
//===============================================================
Joint.prototype.Render = function(  ){


};



//===============================================================
//	
//
//===============================================================
Joint.prototype.SetMaterial = function( ){

};



//===============================================================
//	The mesh will be the Joints geometry plus the material.
//
//===============================================================
Joint.prototype.SetMesh = function(  ){
	// Probably redundant!

};



//===============================================================
//	The mesh will be the Joints geometry plus the material.
//
//===============================================================
Joint.prototype.getPosition = function(  ){

	return ( this._mesh.position );
	
};

//===============================================================
//	Set the position of the joint.
//
//===============================================================
Joint.prototype.setPosition = function( position ){

	this._mesh.position = position;
	
};