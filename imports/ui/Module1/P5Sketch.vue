<template>
	<div>
		<vue-p5  v-on="{ setup, draw, mouseclicked}"></vue-p5>
	</div>
</template>

<script>

	//**************************************
	class HSLColorPalette {
		constructor(x, y, h,s,l) {
			this.x=x;
			this.y = y;
			this.h = h;
			this.s = s;
			this.l = l;
		}
	}

	class HSLColor {
		constructor(h,s,l) {
			this.h = h;
			this.s = s;
			this.l = l;
		}
	}


	import VueP5 from 'vue-p5';
	 
	export default {

		data(){
			return{
				pixels:Array,
				pixSize:Number,
				palette:Array,
				nbClrPalette:Number,
				clrPaletteSize:Number,
				currentColor:HSLColorPalette,
			}
		},

		props: {
	  		imgDim:Number,
	  		width:Number,
	  		height:Number,
	  	},

	  	mounted:function(){
	  	},

		methods: {

			handleResize() {
	    		this.sketch.resizeCanvas(this.width, this.height);
	    		this.pixSize = this.width/this.imgDim;
	    		this.clrPaletteSize = this.width/16; 

	    		//rcalculer les coordonnées des palettes
	    		for (let i=0; i<8; i++) {
		      		for (let j=0; j<16; j++) {
		      			this.palette[i][j].x = j*this.clrPaletteSize
		      			this.palette[i][j].y = i*this.clrPaletteSize+this.width*1.5;
		      		}
		      	}
	    	},

		    setup(sketch) {
		    	this.sketch = sketch;
		      	sketch.resizeCanvas(this.width, this.height);
		      	window.addEventListener('resize', this.handleResize);
		      	this.pixSize = this.width/this.imgDim;


		      	//*********************************************//
		      	//setup palette
		      	//*********************************************//
		      	this.palette=[];
		      	//this.nbClrPalette = 8
		      	this.clrPaletteSize = this.width/16;

		      	
		      	for (let y=0; y<8; y++) {
		      		this.palette[y]= []
		      		let hue = Math.floor(y * 356/8);
		      		//change color
		      		for (let x=0; x<16; x++) {
		      			let light = Math.floor((x * 100/16)+100/16);
		      			
		      			this.palette[y][x] = new HSLColorPalette(x*this.clrPaletteSize,y*this.clrPaletteSize+this.width*1.5, hue, 100, light);
		      		}
		      	}
		      	
		      	this.currentColor = this.palette[0][0];


		      	//*********************************************//
		      	//setup image
		      	this.pixels = new Array(this.imgDim);
    				for (let i = 0; i<this.imgDim;i++)
      					this.pixels[i] = new Array(this.imgDim);
			    
	    	},


	    	draw(sketch) {		
				this.sketch.clear();
		      	this.sketch.background('rgba(255,255,255, 0.5)');


		      	this.drawPalette(sketch);
		      	this.drawImage(sketch);
		      	this.drawCursor(sketch);    	
	    	},

	    	drawPalette(sketch){
	    		let y = this.width;
	    		sketch.stroke(255);
	    		sketch.strokeWeight(3);
	    		sketch.rectMode(sketch.CORNER);
		      	for (let y=0; y<8; y++) {
		      		for (let x=0; x<16; x++) {

		      			let c = this.palette[y][x];
		      			let color = sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)');

		      			
						sketch.fill(color);
						//console.log('hsl('+c.h+','+c.s+'%,'+c.l+'%)')
		      			sketch.rect(c.x, c.y, this.clrPaletteSize, this.clrPaletteSize);
		      		}
		      	}
	    	},

	    	drawImage(sketch){

	    		this.sketch.fill(10,10,10,20)
		      	this.sketch.rect(0,0, this.width, this.width);

	    		sketch.noStroke();
	    		sketch.rectMode(sketch.CORNER);

				for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++) {
		      			let c = this.pixels[y][x];
		      			//console.log(c);	
		      			if (c) {
		      				//console.log(c)
		      				sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'))
		      				sketch.rect(x*this.pixSize, y*this.pixSize, this.pixSize, this.pixSize);
		      			}
		      		}
		     	}
	    	},

	    	drawCursor(sketch){
	    		let c = this.currentColor;
	    		sketch.ellipseMode(sketch.CENTER);
	    		sketch.fill(sketch.color('hsl('+c.h+','+c.s+'%,'+c.l+'%)'));
	    		sketch.rectMode(sketch.CENTER);
	    		sketch.rect(sketch.mouseX, sketch.mouseY, this.pixSize, this.pixSize)
	    	},


	    	mouseclicked(sketch,e) {

	    		//check si on a bien cliqué sur le canvas et pas sur une div au-dessus du canvas
	    		if (e.target.className === 'p5Canvas') {

	    			//si on clique sur la palette
	    			for (let i=0; i<8; i++) {
		      			for (let j=0; j<16; j++) {
		      				let x = this.palette[i][j].x;
		      				let y = this.palette[i][j].y;
		      				if (sketch.mouseX > x && sketch.mouseX < x+this.clrPaletteSize
		      					&& sketch.mouseY > y && sketch.mouseY < y+this.clrPaletteSize) {
		      					this.currentColor = this.palette[i][j];
		      					break;
		      				}
		      			}
		      		}
		      		
		      		//si on clique sur l'image
	    			let x= Math.floor(sketch.mouseX/this.pixSize);
	    			let y= Math.floor(sketch.mouseY/this.pixSize);
	    			let c = this.currentColor

		    		if (x >=0 && x<this.imgDim && y >=0 && y<this.imgDim) {

		    			//si c'est blanc
		    			if (c.l == 100)
		    				this.pixels[y][x]=null;
		    			else
		    			//sinon
		    				this.pixels[y][x] = new HSLColor(c.h, c.s, c.l);

		    			this.$emit('add-cubes',x ,this.imgDim-(y+1),c.h, c.s, c.l);	
		    		}
	    		}
	    		
	    	},

	    	addPixel(x, y, clr){
	    		this.pixels[y][x] = new HSLColor(clr.h, clr.s, clr.l);
	    	},


	    	clearAllPixels(){
	    		for (let y =0; y< this.imgDim; y++){
		      		for (let x=0; x<this.imgDim; x++)
		      			this.pixels[y][x] = false;  		
		     	}
	    	},

	    	loadPixels(pixels){
	    		//on fait une copie
	    		for (var i = 0; i < pixels.length; i++)
    				this.pixels[i] = pixels[i].slice();
	    	},

	    	saveToBitmap() {
	    		let cv = this.$refs.cvSave;
	    		let data = cv.toDataURL('image/bmp');
	    		return data;
	    	},
	  	},


	  	components: {
		    "vue-p5": VueP5
		},

	}

	
	
</script>

