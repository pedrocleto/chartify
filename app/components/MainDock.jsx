'use strict';

var React = require('react/addons');
var ChartBox = require('./ChartBox');
var fire = require('../db/firebase');

var MainDock = React.createClass({

	getInitialState: function(){
    	return {link:"",
    			charts:[]};
  	},

	componentDidMount:function() {
		var pathArray = window.location.pathname.split( '/' );
		var newPostRef;
		if(pathArray && pathArray.length>=2)
		{
			var id = pathArray[1];
			if(id && id !='')
				this.fire = fire.getRef().child('charts/'+id);
		}
		if(!this.fire)
		{
			newPostRef = fire.getRef().child('charts');
			this.fire = newPostRef.push({});
		}
		this.fire.on('value', this.updateMe);
	},

	componentWillUnmount:function() {
		this.fire.off('value', this.updateMe)
	},

	updateMe:function(snapshot) {
		var exists = (snapshot.val() !== null);
		var newPostRef;
		var pathArray = window.location.pathname.split( '/' );
		if(!exists && pathArray && pathArray.length>=2)
		{
			var id = pathArray[1];
			if(id && id !='')
			{
				this.fire.off('value', this.updateMe);
				newPostRef = fire.getRef().child('charts');
				this.fire = newPostRef.push({});
				window.history.pushState(null, "New chart!", "/");
				this.fire.on('value', this.updateMe);
			}
			
		}
		else
		{
			var clips = this.convertToArray(snapshot.val());
			this.setState({clips})
		}
	},

	convertToArray:function(snapshotVal){
		var array = [];
		if(!snapshotVal) return array;
		for (var key in snapshotVal)
		{
			array.push({id:key, val:snapshotVal[key]});
		}

		return array;
	},

	addClips:function(ev){
		ev.preventDefault();
		this.fire.push({
			text:"Write a text or paste a link",
			name:'New Title',
			linkID:'',
			link:"",
			pos: {x: 0, y: 0},
	  		showVideo:'none',
	  		showText:'block',
	  		zIndex:0,
	  		parentID:this.fire.key()
	    })

	},

	saveClipsLink:function(ev){
		ev.preventDefault();
		window.history.pushState(null, "Chartified!", "/"+this.fire.key());
	},

	render: function() {
	    return (
	      <div className = "mainDock">
	      	{this.state.charts.map(function(result) {
           		return <ChartBox key={result.id} data={result}/>;
        	})}
	      </div>
	    );
  	}
});
module.exports = MainDock;