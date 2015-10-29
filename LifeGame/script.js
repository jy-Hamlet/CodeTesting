var rowCount,columnCount,matrix,running
    running  = false
	//表示方格状态
    dead = 0
    alive = 1
    wall = 2

    cellSize = 13
    canvas =null
    drawingContext=null
    //方格填充颜色
    aliveStyle = "#000000"
    deadStyle = "#FFFFFF"
    wallStyle = "#000088"
	//活细胞密度
    aliveProb = 0.5
	
    cell_mode = 0  //设置细胞模式
    wall_mode = 1  //设置墙模式
    mode = 0       //表示当前模式	
    timer = 100    //刷新周期（ms）
	//关联细胞坐标
    DX = [ 0, 0, 0, 0,-2,-1, 1, 2]
    DY = [-2,-1, 1, 2, 0, 0, 0, 0]

	//批量绘制方格内容
    function draw_cell(){
        drawingContext.fillStyle = deadStyle
        drawingContext.fillRect(0, 0, canvas.width,canvas.height)
            for (row=2;row<=rowCount+1;row++){
                for(col=2;col<=columnCount+1;col++){
                    x = (row-2)*cellSize
                    y = (col-2)*cellSize
                    if (matrix[row][col] == alive){
                        drawingContext.fillStyle = aliveStyle
                    }
                    else if (matrix[row][col] == dead){
                        continue;
                        drawingContext.fillStyle = deadStyle
                    }
                    else{
                        drawingContext.fillStyle = wallStyle
                    }
                    drawingContext.fillRect(x, y,cellSize,cellSize)    
                }
            }
    }
	//绘制网格
    function draw_grid(){
        drawingContext.strokeStyle = '#808080'
        for (var col = 0; col <= columnCount; col++) {
            drawingContext.moveTo(0, col * cellSize)
            drawingContext.lineTo(canvas.width, col * cellSize)
        }
        for (var row = 0; row <= rowCount; row++) {
            drawingContext.moveTo(row * cellSize,0)
            drawingContext.lineTo(row * cellSize,canvas.height )
        }
        drawingContext.lineWidth =1
        drawingContext.stroke()

    }
    //开始-暂停
    function stop(){
        if(running){
            running  = false
            $("#stop").text("开始")
            $("#r_s").css("display", "block")
        }
        else{
            running  = true
            $("#stop").text("暂停")
            $("#r_s").css("display", "None")
            loop()
        }
        
    }
    //转换设置模式
    function change_mode(){
        if (mode == cell_mode){
            mode = wall_mode
            $('#mode_now').text("墙壁")
            $('#mode_to').text("细胞")
        }
        else if (mode == wall_mode){
            mode = cell_mode
            $('#mode_now').text("细胞")
            $('#mode_to').text("墙壁")
        }
    }
	//自定义行列数
	function set_RandC(){
		var rowCount_t = Number($("#rowCount").val())
		var columnCount_t = Number($("#columnCount").val())
        if (isNaN(rowCount_t) || isNaN(columnCount_t)){
            alert("请输入正整数！")
            return false
        }
        else if (rowCount_t <= 0 || columnCount_t <= 0 || parseInt(rowCount_t)!=rowCount_t || parseInt(columnCount_t)!=columnCount_t){
            alert("请输入正整数！")
            return false
        }
		else
		{
			rowCount = rowCount_t
			columnCount = columnCount_t
			return true
		}	
	}
	//设置画布
    function reload(){
		if (!set_RandC()){
			return
		}

        function set_matrix(){
            matrix = new Array(rowCount+4)
            for (var i = rowCount+3; i >= 0; i--) {
                matrix[i] = new Array(columnCount+4)
                for (var j = columnCount+3; j >= 0; j--) {
                    matrix[i][j] = dead
                };
            };
        }       
        function set_map(){
            var map = $("#map")
            map.empty();
            canvas = document.createElement('canvas')
            map.append(canvas)
            drawingContext = canvas.getContext("2d")
            canvas.width = cellSize * rowCount
            canvas.height = cellSize * columnCount
            draw_grid()
            
            matrix_t = new Array(rowCount+4)
            for (var i = rowCount+3; i >= 0; i--) {
                matrix_t[i] = new Array(columnCount+4)
            };            
        }
        set_matrix()
        set_map()      
        canvas.addEventListener('click', function(evt) {
            var mousePos = getMousePos(canvas, evt);
            click_cell( 1+parseInt(mousePos.x / cellSize), 1+parseInt(mousePos.y / cellSize))
        }, false);  
        running = true
        stop()
        $("#r_s").css("display", "block")
    }
    //设置活细胞密度
	function set_aliveProb(){
		var aliveProb_t = Number($("#probability").val())
        if (isNaN(aliveProb_t)){
            alert("请输入一个大于0小于1的数！")
            return false
        }
        else if (aliveProb_t <= 0 || aliveProb_t >=1){
            alert("请输入一个大于0小于1的数！")
            return false
        }
		else
		{
			aliveProb = aliveProb_t
			return true
		}
	}
	//随机生成地图
    function random_set(){
        if (!set_aliveProb()){
			return
		}
        function set_matrix(){
            matrix = new Array(rowCount+2)
            for (var i = rowCount+1; i >= 0; i--) {
                matrix[i] = new Array(columnCount+2)
                for (var j = columnCount+1; j >= 0; j--) {
                    matrix[i][j] = (Math.random() < aliveProb)
                };
            };
        }       
        set_matrix()     
        running = true
        draw_cell()
        draw_grid()
        stop()
    }

    function clean(){
        reload()
    }
	//设置刷新周期
    function set_timer(){
        var timer_t = Number($("#timer").val())
        if (isNaN(timer_t)){
            alert("请输入一个大于0的数！")
            return
        }
        else if (timer_t <= 0){
            alert("请输入一个大于0的数！")
            return
        }
        else{
            timer = timer_t
        }
    }
	//迭代主逻辑
    function loop() {
        if(false == running){
            return
        }
        function envolve_cells(){
            //初始化过渡数组
            for (var row = 0;row <= rowCount+3;row++){
                for (var col=0;col<=columnCount+3;col++){
                    matrix_t[row][col] = 0;
                }
            }
            for (var x=2;x<=rowCount+1;x++){
                for(var y=2;y<=columnCount+1;y++){
                    if (matrix[x][y] == alive){
                        
                        for (var i = 0; i < 8; i++){
                            matrix_t[x+DX[i]][y+DY[i]]++
                        }
                        
                    }
                }
            }
            for (var x=2;x<=rowCount+1;x++){
                for(var y=2;y<=columnCount+1;y++){
                    if ((matrix[x][y] == wall) ||(matrix_t[x][y] == 2)){
                        continue
                    }
                    else if (matrix_t[x][y] == 3){
                        matrix[x][y] = alive
                    }
                    else{
                        matrix[x][y] = dead
                    }
                }
            }       
        }
        envolve_cells()        
        draw_cell()
        draw_grid()
        setTimeout(function () {
            loop();
        }, timer);
    }
	//鼠标坐标转译
    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
        };
    }
	//点击事件处理
    function click_cell(x,y){
        if (mode == cell_mode){
            if(matrix[x+1][y+1] == alive){
                matrix[x+1][y+1] = dead
            }
            else
            {
                 matrix[x+1][y+1] = alive
            }
        }
        if (mode == wall_mode){
            if(matrix[x+1][y+1] == wall){
                matrix[x+1][y+1] = dead
            }
            else
            {
                 matrix[x+1][y+1] = wall
            }
        }
        draw_cell()
        draw_grid()
    }