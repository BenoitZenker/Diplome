<template>
  <div id="NavRight">
    <div id="next">
      <input type="button" value="Aller à ...">
      <input type="button" value="Aller à ...">
    </div>
      <input type="button" value="Finir">
  </div>
</template>



<script>

</script>




<style scoped>
  #NavRight {
    position:fixed;
    top:40px;
    right:0;
    width:250px;
    height:calc(100vh - 40px);

    display:flex;
    flex-direction: column;
    align-items:center;
    justify-content: center;

    /*background-color: blue;*/

  }

  #next {
    margin-bottom:8px;
  }


  input {

    margin-left: 60px;

    font-size:18px;
    padding:4px 16px 4px 16px;
    border-radius:0;
    color:black;
    border: none;
    display:block;

    margin-bottom:4px;
  }

</style>