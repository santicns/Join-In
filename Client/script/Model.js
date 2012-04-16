/*

	A model that represents all the joint data from the kinect.
	Upon creation there will be 15 joints.
	After construction the individual joints data will be passed as a map.

*/

function Model( name, jointNames ){

	this._joint = {};				// Map of joint objects.
	this._jointNames = jointNames;	// Array of key values for the kinect data.
		
	// Construct all the joints.
	for( var i = 0; i < this._jointNames.length; i++){
	
		this._joint[ this._jointNames[ i ] ] = new Joint(  );
		
		// Give it a random position.
		this._joint[ this._jointNames[ i ] ].setPosition(  new THREE.Vector3( 
		Math.floor((Math.random()*1000)), Math.floor((Math.random()*1000)), Math.floor((Math.random()*1000))
		));
		
	}//End for
}



/*
	Probably be never used.


*/
Model.prototype.setJointPosition = function( name, pos ){

	this._joint[ name ].setPosition( pos );
}

/*
	Probably be never used.


*/
Model.prototype.setAllJoints = function( map ){

	// Cycle through the joints and set the according to the map.
	for (var i =0; i < this._jointNames.length; i++){
	
		this._joint[ this._jointNames[ i ] ].setPosition( map[this._jointNames[ i ]] );
	}
}

/*
	Probably be never used.


*/
Model.prototype.getPosition = function(  ){

	// A center of mass of the Player.
	if ( kinectMap['HEAD'] != undefined	 ){
	
		return ( this._joint[ 'TORSO' ].getPosition() );
	}
	else{
		
		return ( new THREE.Vector3( 0,0,0) );
	}
	
}