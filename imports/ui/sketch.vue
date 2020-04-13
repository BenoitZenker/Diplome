<template>
	<vue-p5 v-on="{ setup, draw}"></vue-p5>
</template>

<script>
	import VueP5 from 'vue-p5';
	 
	export default {
		methods: {
		    setup(sketch) {
		      sketch.background('green');
		      sketch.text(this.text, 20, 20);
	    	},

	    	draw(sketch) {
		      sketch.background('green');
		      sketch.text(this.text, 20, 20);
	    	}
	  	},


	  	props: {
	  		text: String,
	  	},

	  	components: {
		    "vue-p5": VueP5
		},
	}

	
	
</script>

