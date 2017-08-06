// 1、函数大写开头
// 2、属性小写开头
// 3、Get 给的是原引用。
// 4、Bool 检查的是属性的取值范围。

//围棋APP
function AppWeiqi (display_id){
    var DEFAULT_GAME_SiZE = 19;
    var MIN_GAME_SiZE = 9;
    var MAX_GAME_SiZE = 26;
    var DEFAULT_GAME_PLAYER = 2;
    var DEFAULT_DISPLAY_SIZE = 27;


    var APP = this;

    //点计算
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.Str = function(){
        return '('+this.x+','+this.y+')';
    }
    //检查x y 是否符合本对象的取值范围。
    Point.prototype.Bool = function() {
        return !isNaN(this.x) && !isNaN(this.y) && this.x >= 0 && this.y >= 0;
    }
    Point.prototype.Clone = function() {
        return new Point(this.x, this.y);
    }
    Point.prototype.Equals = function(p) {
        return p.x === this.x && p.y === this.y;
    }

    Point.prototype.GetUp = function() {
        return new Point(this.x, this.y -1);
    }
    Point.prototype.GetDown = function() {
        return new Point(this.x, this.y +1);
    }
    Point.prototype.GetLeft = function() {
        return new Point(this.x-1, this.y);
    }
    Point.prototype.GetRight = function() {
        return new Point(this.x+1, this.y);
    }
    Point.prototype.GetNears = function() {
        return [this.GetUp(), this.GetDown(), this.GetLeft(), this.GetRight()];
    }

    //点集合计算
    function PointSet() {
        this.data = [];
    }
    PointSet.prototype.Str= function() {
        var str_item = [];
        for( var i = 0; i< this.data.length; i++) {
            str_item.push(this.data[i].Str());
        }
        return str_item.join(', ');
    }
    PointSet.prototype.Clone = function() {
        var clone = new PointSet() ;
        for( var i = 0; i < this.data.length; i ++) {
            clone.set.push(this.data[i].Clone());
        }
        return clone;
    }
    PointSet.prototype.CloneToList = function() {
        var clone = [];
        for( var i = 0; i < this.data.length; i ++) {
            clone.push(this.data[i].Clone());
        }
        return clone;
    }
    PointSet.prototype.Has = function(p) {
        for( var i = 0; i<this.data.length; i++) {
            if (this.data[i].Equals(p)) {
                return true;
            }
        }
        return false;
    }
    PointSet.prototype.Equals = function(pset) {
        if( pset instanceof PointSet) {
            if (pset.set.length === this.data.length) {
                for(var i = 0; i< pset.set.length; i++) {
                    if( !this.Has(pset.set[i])) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    PointSet.prototype.Length = function(){
        return this.data.length;
    }
    PointSet.prototype.Add = function(p) {
        if(this.Has(p)) {
            return false;
        }
        this.data.push(p);
        return true;
    }
    PointSet.prototype.AddList= function(plist) {
        var news = [];
        for( var i = 0; i< plist.length; i++) {
            if( this.Add(plist[i])) {
                news.push(plist[i])
            }
        }
        return news;
    }
    PointSet.prototype.AddMany= function() {
        var news = [];
        for( var i = 0; i< arguments.length; i++) {
            if( this.Add(arguments[i])) {
                news.push(arguments[i])
            }
        }
        return news;
    }
    PointSet.prototype.Union = function(pset) {
        var news = [];
        for( var i = 0; i< pset.set.length; i++) {
            if( this.Add(pset.set[i])) {
                news.push(pset.set[i])
            }
        }
        return news;
    }
    PointSet.prototype.Del = function(i) {
        this.data.splice(i, 1);
    }
    PointSet.prototype.Remove = function(p) {
        for( var i = 0; i< this.data.length; i++) {
            if( this.data[i].Equals(p)) {
                this.data.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    PointSet.prototype.Set = function(i, p) {
        this.data[i] = p;
    }
    PointSet.prototype.Get = function(i) {
        return this.data[i];
    }
    PointSet.prototype.Find = function(p) {
        for(var i = 0; i < this.data.length; i++) {
            if (this.data[i].Equals(p)) {
                return i;
            }
        }
        return null;
    }
    //清除所有数据。
    PointSet.prototype.Clear = function() {
        this.data = [];
    }

    //元计算
    function Cell(player, number) {
        this.player = player? player: 0;
        this.number = number? number: 0;
    }

    Cell.prototype.Str= function(){
        return '['+this.player+','+this.number+']';
    }
    //属性是否符合本对象的取值范围。
    Cell.prototype.Bool = function () {
        return !isNaN(this.player) && this.player >= 0 && !isNaN(this.number) && this.number >= 0;
    }
    Cell.prototype.Clone = function() {
        return new Cell(this.player, this.number);
    }
    Cell.prototype.Equals = function(c) {
        return c.player === this.player && c.number === this.number;
    }
    //属性值置零。
    Cell.prototype.Clear = function() {
        this.player = 0;
        this.number = 0;
    }

    //图计算
    function CellMap(size) {
        this.size = size? size : DEFAULT_GAME_SiZE;
        this.data = [];

        if(isNaN(this.size) || this.size <= 0 || this.size > MAX_GAME_SiZE) {
            this.size = DEFAULT_GAME_SiZE;
        }
        for( var x = 0; x< this.size; x++) {
            var row = [];
            for( var y = 0; y< this.size; y++) {
                row.push(new Cell());
            }
            this.data.push(row);
        }
    }
    CellMap.prototype.Str = function() {
        var rows = [];
        for( var x = 0; x< this.size; x++) {
            var items = [];
            for( var y = 0; y< this.size; y++) {
                items.push(this.data[x][y].Str());
            }
            rows.push(items.join());
        }
        return rows.join('\r\n');
    }
    CellMap.prototype.StrPlayer = function() {
        var rows = [];
        for( var x = 0; x< this.size; x++) {
            var items = [];
            for( var y = 0; y< this.size; y++) {
                items.push(this.data[x][y].player);
            }
            rows.push(items.join());
        }
        return rows.join('\r\n');
    }
    CellMap.prototype.StrNumber = function() {
        var rows = [];
        for( var x = 0; x< this.size; x++) {
            var items = [];
            for( var y = 0; y< this.size; y++) {
                items.push(this.data[x][y].number);
            }
            rows.push(items.join());
        }
        return rows.join('\r\n');
    }
    CellMap.prototype.ForeachCell = function(f) {
        for( var x = 0; x< this.size; x++) {
            for( var y = 0; y< this.size; y++) {
                f(this.data[x][y]);
            }
        }
    }
    CellMap.prototype.Clone = function() {
        var map = new CellMap(this.size);
        for( var x = 0; x < this.size; x ++) {
            for( var y = 0; y < this.size; y ++) {
                map.data[x][y] = this.data[x][y].Clone();
            }
        }
        return map;
    }
    CellMap.prototype.Equals = function(cellmap) {
        if(this.size != cellmap.size) {
            return false;
        }
        for( var x = 0; x < this.size; x++) {
            for( var y = 0; y < this.size; y++ ) {
                if( !this.data[x][y].Equals(cellmap.data[x][y]) ) {
                    return false;
                }
            }
        }
        return true;
    }
    CellMap.prototype.EqualsPlayer = function(cellmap) {
        if(this.size != cellmap.size) {
            return false;
        }
        for( var x = 0; x < this.size; x++) {
            for( var y = 0; y < this.size; y++ ) {
                if( this.data[x][y].player !== cellmap.data[x][y].player ) {
                    return false;
                }
            }
        }
        return true;
    }
    CellMap.prototype.HasPoint = function(p) {
        if(p.Bool() && p.x < this.size && p.y < this.size ) {
            return true;
        }
        return false;
    }
    CellMap.prototype.HasPlayer = function(p) {
        return this.data[p.x][p.y].player > 0;
    }
    CellMap.prototype.HasNumber = function(p) {
        return this.data[p.x][p.y].number > 0;
    }
    CellMap.prototype.HasPlayerAndNumber = function(p) {
        return this.HasPlayer(p) && this.HasNumber(p);
    }
    CellMap.prototype.Get = function(p) {
        return  this.data[p.x][p.y];
    }
    //置零
    CellMap.prototype.Clear = function() {
        for( var x = 0; x< this.size; x++) {
            for( var y = 0; y< this.size; y++) {
                this.data[x][y].Clear();
            }
        }
    }
    CellMap.prototype.ClearByPoint = function(p) {
        this.data[p.x][p.y].Clear();
    }
    CellMap.prototype.ClearByPointSet = function(pointset){
        for( var i = 0; i< pointset.Length(); i++) {
            var p = pointset.Get(i);
            this.data[p.x][p.y].Clear();
        }
        return pointset.Length();
    }
    CellMap.prototype.ClearByPointList = function(pointlist ) {
        for( var i = 0; i < pointlist.length; i++) {
            var p = pointlist[i];
            this.data[p.x][p.y].Clear();
        }
        return pointlist.length;
    }

    CellMap.prototype.SetCellByPoint = function(p, cell) {
        this.data[p.x][p.y] = cell;
    }
    CellMap.prototype.SetPlayerByPoint = function(p, player) {
        this.data[p.x][p.y].player = player;
    }
    CellMap.prototype.SetNumberByPoint = function(p, number) {
        this.data[p.x][p.y].number = number;
    }

    //保存移动数据的对象。
    function Move(count, player, point, cellmap) {
        this.count = count ? count : 0;
        this.player = player ? player : 0;
        this.point = point ? point : new Point();
        this.cellmap = cellmap ? cellmap : new CellMap(DEFAULT_GAME_SiZE);

        //父节点
        this.father = null;
        //子节点
        this.children = [];
    }
    Move.prototype.Str = function() {
        var item = [];
        item.push('手数='+this.count);
        item.push('玩家='+this.player);
        item.push('位置='+this.point.Str());
        return item.join();
    }
    Move.prototype.Clone = function() {
        var move = new Move(this.count, this.player, this.point.Clone(), this.cellmap.Clone());
        move.father = this.father ? this.father.Clone() : null;
        for(var i = 0; i < this.children.length; i ++) {
            move.children[i] = this.children[i].Clone();
        }
        return move;
    }
    Move.prototype.SetFather = function(father) {
        this.father = father;
    }
    Move.prototype.AppendChild = function(move) {
        this.children.push(move);
    }     
    Move.prototype.GetChildBy = function(i) {
        if( i >= this.children.length) return null;
        return this.children[i];
    }
    Move.prototype.GetChild = function() {
        if(this.children.length === 0 ) return null;
        return this.children[0];
    }
    Move.prototype.GetLast = function(){
        if( this.children.length === 0 ) return null;
        var child = this.children[0];
        while(child.children.length !==0 ) {
            child = child.children[0];
        }
        return child;
    }
    Move.prototype.GetFather = function() {
        return this.father
    }
    Move.prototype.GetRoot = function() {
        var father = this.father;
        while(father) {
            father = father.father;
        }
        return father;
    }


    var GetUpPointByPlayer = function(player, point, cellmap) {
        var p = point.GetUp();
        if( p.Bool() && cellmap.HasPoint(p) && (cellmap.Get(p).player === player)) {
            return p;
        }
        return null;
    }
    var GetDownPointByPlayer = function(player, point, cellmap) {
        var p = point.GetDown();
        if( p.Bool() && cellmap.HasPoint(p) && (cellmap.Get(p).player === player)) {
            return p;
        }
        return null;
    }
    var GetLeftPointByPlayer = function(player, point, cellmap) {
        var p = point.GetLeft();
        if( p.Bool() && cellmap.HasPoint(p) && (cellmap.Get(p).player === player)) {
            return p;
        }
        return null;
    }
    var GetRightPointByPlayer = function(player, point, cellmap) {
        var p = point.GetRight();
        if( p.Bool() && cellmap.HasPoint(p) && (cellmap.Get(p).player === player)) {
            return p;
        }
        return null;
    }
    var GetNearPointListByPlayer = function(player, point, cellmap) {
        var near = [];
        var up = GetUpPointByPlayer(player, point, cellmap) ;
        if (up){
            near.push(up);
        }
        var down = GetDownPointByPlayer(player, point, cellmap);
        if( down ) {
            near.push(down);
        }
        var left = GetLeftPointByPlayer(player, point, cellmap);
        if( left) {
            near.push(left);
        }
        var right = GetRightPointByPlayer(player, point, cellmap);
        if( right) {
            near.push(right);
        }
        return near;
    }
    var SearchAroundByPlayer = function(player, point, cellmap, point_set) {
        var near = GetNearPointListByPlayer(player, point, cellmap);
        var news = point_set.AddList(near);
        for( var i = 0; i< news.length; i++) {
            SearchAroundByPlayer(player, news[i], cellmap, point_set);
        }
    }
    var GetAroundByPlayer = function(player, point, cellmap) {
        var pointset = new PointSet();
        if( cellmap.Get(point).player === player) {
            pointset.Add(point);
            SearchAroundByPlayer(player, point, cellmap, pointset);
        }
        return pointset;
    }
    var LifeCount = function(pointset, cellmap) {
        var lives = new PointSet();
        for( var i = 0; i < pointset.Length(); i++) {
            var points = GetNearPointListByPlayer(0, pointset.Get(i), cellmap);
            if( points.length>0) {
                lives.AddList(points);
            }
        }
        return lives;
    }

    //玩家控制器
    function PlayerController(player_max) {
        this.max = player_max ? player_max: DEFAULT_GAME_PLAYER;
        this.current = 1;
        this.count = 1;
    }
    PlayerController.prototype.Next = function() {
        this.current++;
        this.count++;
        if (this.current > this.max) {
            this.current = 1;
        }
    }
    PlayerController.prototype.Reset = function() {
        this.current = 1;
        this.count = 1;
    }
    PlayerController.prototype.GetCurrent = function() {
        return this.current;
    }
    PlayerController.prototype.GetCount = function() {
        return this.count;
    }
    PlayerController.prototype.OtherList = function() {
        var other = [];
        for( var i = 1; i <= this.max; i++) {
            if (i != this.current) other.push(i);
        }
        return other;
    }
    PlayerController.prototype.Move = function(point, cellmap) {
        if( point.Bool() && cellmap.HasPoint(point) && !cellmap.HasPlayer(point)) {
            cellmap.SetCellByPoint(point, new Cell(this.current, this.count)) ;

            var other_player_list = this.OtherList();
            var clear_count = 0;
            for( var i = 0; i < other_player_list.length; i++) {
                var other_player = other_player_list[i];
                var clear = 0;
                
                var p_list = point.GetNears();
                for( var j = 0; j < p_list.length; j++) {
                    var p = p_list[j];
                    if( cellmap.HasPoint(p) && (cellmap.Get(p).player === other_player)) {
                        var p_set = GetAroundByPlayer(other_player, p, cellmap);
                        var p_lives = LifeCount(p_set, cellmap);
                        if( p_lives.Length()===0)
                            clear += cellmap.ClearByPointSet(p_set);
                    }
                }
                clear_count += clear;
            }
            if(clear_count === 0 ) {
                var point_set = GetAroundByPlayer(this.current, point, cellmap);
                var point_set_lives = LifeCount( point_set, cellmap);
                if( point_set_lives.Length() === 0){
                    return null;
                }
            }
            return new Move(this.count, this.current, point, cellmap);
        }
        return null;
    }

    function Game(playersize, firstmap) {
        var Game = this;
        var Player = new PlayerController(playersize);
        var Root = new Move();
        Root.cellmap = firstmap.Clone();
        var Now = Root;

        
        Game.Move = function( point ) {
            var move = Player.Move(point, Now.cellmap.Clone());
            if( move) {
                var tryfather = Now.father;
                if( tryfather ) {
                    console.log('has father');
                    if( tryfather.cellmap.EqualsPlayer(move.cellmap)) {
                        console.log('同型');
                        return false;
                    }
                }

                Player.Next();

                move.SetFather( Now );
                Now.AppendChild(move);
                Now = move;

                return true;
            }
            return false;
        }

        Game.GetNowMap = function() {
            return Now.cellmap;
        }

        Game.MoveForward = function() {

        }
        Game.MoveBack = function() {

        }
        Game.MoveTo = function(number) {

        }


    }
    

    //先设置背景图片和棋子图片。
    //然后Load就可以了。
    //棋盘状态改变后，按图刷新即可。
    function ChessBoardByCanvas(canvas) {
        if( !canvas) return null;
        var Obj = this;

        var Mark = 0;
        var Black = 1;
        var White = 2;

        var TagY = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26"];
        var TagX = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

        var Canvas = canvas;
        var CanvasContext = Canvas.getContext('2d');

        //棋盘
        var DisplaySize = DEFAULT_DISPLAY_SIZE;
        var GameSize = DEFAULT_GAME_SiZE;
        //棋盘的绘制大小。
        var BoardSize = 0;
        //棋盘边缘大小
        var BoardMargin = 0;
        //棋盘棋子绘制和事件监听起始位置
        var BoardStartXY = 0;
        //画布大小
        var CanvasSize = 0;

        function SetSize () {
            BoardSize = DisplaySize*(GameSize-1);
            BoardMargin = DisplaySize * 0.8;
            BoardStartXY = BoardMargin - DisplaySize/2;
            CanvasSize = DisplaySize * (GameSize-1) + BoardMargin * 2;
            Canvas.width = CanvasSize;
            Canvas.height = CanvasSize;
        }
        SetSize();
        //设置显示基数
        Obj.SetDisplaySize = function(display_size) {
            if( !isNaN(display_size) && display_size) {
                if( display_size < 10 ) {
                    display_size = 10;
                }
            } else {
                return null;
            }
            DisplaySize = display_size;
            SetSize();
        }
        //设置游戏大小。
        Obj.SetGameSize = function(game_size) {
            if(!isNaN(game_size)) {
                if( game_size > TagX.length) {
                    game_size = TagX.length;
                } else if( game_size < 9) {
                    game_size = 9;
                }
            } else {
                return null; 
            }
            GameSize = game_size;
            SetSize();
        }

        //背景
        var BackgroundImageSrcList = [];
        var BackgroundImageList = [];
        var BackgroundImageIndex = 0;
        //添加背景图片
        Obj.SetBackgroundImageSrcList = function(image_list) {
            BackgroundImageSrcList = [];
            for(var i = 0; i < image_list.length; i++) {
                BackgroundImageSrcList.push(image_list[i]);
            }

        }
        Obj.AddBackgroundImageSrcList = function() {
            BackgroundImageSrcList = BackgroundImageSrcList.concat(arguments);
        };
        Obj.LoadBackgroundImageList = function(callback) {
            BackgroundImageList = [];
            var n = BackgroundImageSrcList.length;
            for( var i = 0; i < BackgroundImageSrcList.length; i++) {
                var img = new Image();
                img.src = BackgroundImageSrcList[i];
                BackgroundImageList[i] = img;
                BackgroundImageList[i].onload = function() {
                    n--;
                    console.log('载入背景图片。。。剩余'+n);
                    if( !n) {
                        console.log('背景图片载入完成。');
                        if( callback) {
                            callback();
                        }
                    }
                }
            }
            return BackgroundImageList.length;
        }
        //选用背景图片.
        Obj.SetBackgroundImageIndex = function(i) {
            BackgroundImageIndex = i;
        };
        //绘画背景图片.
        Obj.DrawBackgroundImage = function () {
            if (BackgroundImageIndex < BackgroundImageList.length && BackgroundImageIndex >= 0)
                CanvasContext.drawImage(BackgroundImageList[BackgroundImageIndex], 
                    0, 0, 
                    BoardMargin*2+BoardSize, BoardMargin*2+BoardSize);
        };

        Obj.DrawBackgroundColor = function( ) {
            /*
            var grd = CanvasContext.createLinearGradient(0, 0, BoardMargin*2+BoardSize, BoardMargin*2+BoardSize);
            grd.addColorStop(0.1, '#e0c9aa');
            grd.addColorStop(0.5, '#eecfa1');
            grd.addColorStop(0.9, '#e0c9aa');
            */
            CanvasContext.fillStyle = '#e0c9aa';
            CanvasContext.fillRect(0, 0, BoardMargin*2+BoardSize, BoardMargin*2+BoardSize);
        };
        


        //绘制棋盘
        Obj.DrawChessBoard = function () {
            console.log('绘制棋盘');
            CanvasContext.beginPath();
            //画边框。
            CanvasContext.lineWidth = 1;
            CanvasContext.strokeStyle = '#444';
            CanvasContext.rect(BoardMargin, BoardMargin, BoardSize, BoardSize);
            CanvasContext.stroke();

            //画棋格。
            CanvasContext.lineWidth = 1;
            for ( var i = 1; i<GameSize-1; i++ ) {
                CanvasContext.moveTo(DisplaySize*i+BoardMargin, BoardMargin);
                CanvasContext.lineTo(DisplaySize*i+BoardMargin, BoardMargin+BoardSize);

                CanvasContext.moveTo(BoardMargin, BoardMargin+DisplaySize*i);
                CanvasContext.lineTo(BoardMargin+BoardSize, BoardMargin+DisplaySize*i);
            }
            CanvasContext.stroke();

            //画星位。
            CanvasContext.fillStyle = '#000';
            var arcR = DisplaySize/8;
            if (GameSize === 19) {
                CanvasContext.beginPath();
                CanvasContext.arc(BoardMargin+DisplaySize*3, BoardMargin+DisplaySize*3, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*9, BoardMargin+DisplaySize*3, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*15, BoardMargin+DisplaySize*3, arcR, 0, 2*Math.PI);
                CanvasContext.fill();
                CanvasContext.beginPath();
                CanvasContext.arc(BoardMargin+DisplaySize*3, BoardMargin+DisplaySize*9, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*9, BoardMargin+DisplaySize*9, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*15, BoardMargin+DisplaySize*9, arcR, 0, 2*Math.PI);
                CanvasContext.fill();
                CanvasContext.beginPath();
                CanvasContext.arc(BoardMargin+DisplaySize*3, BoardMargin+DisplaySize*15, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*9, BoardMargin+DisplaySize*15, arcR, 0, 2*Math.PI);
                CanvasContext.arc(BoardMargin+DisplaySize*15, BoardMargin+DisplaySize*15, arcR, 0, 2*Math.PI);
                CanvasContext.fill();
            }

            //画坐标。
            /*
            var fontsize = DisplaySize*3/4;
            CanvasContext.font= fontsize.toString()+"px Asia";
            CanvasContext.textAlign = 'center';
            for (var j=0; j<GameSize; j++) {
                CanvasContext.fillText(TagX[j], BoardMargin+j*DisplaySize, BoardMargin-DisplaySize*3/4);
                CanvasContext.fillText(TagX[j], BoardMargin+j*DisplaySize, BoardMargin+BoardSize+DisplaySize*5/4);
                CanvasContext.fillText(TagY[j], BoardMargin-DisplaySize, BoardMargin+j*DisplaySize+DisplaySize/4);
                CanvasContext.fillText(TagY[j], BoardMargin+DisplaySize+BoardSize, BoardMargin+j*DisplaySize+DisplaySize/4);
            }
            */
            CanvasContext.closePath();

        };

        //下棋事件在这里设置。
        Obj.OnMove = null;
        Canvas.onclick = function (e) {
            var x = Math.floor((e.clientX-Canvas.getBoundingClientRect().left-BoardStartXY)/DisplaySize);
            var y = Math.floor((e.clientY-Canvas.getBoundingClientRect().top-BoardStartXY)/DisplaySize);
            if (x >= 0 && x < GameSize && y >= 0 && y < GameSize){
                if (Obj.OnMove) {
                    Obj.OnMove(x, y);
                } else {
                    Obj.DrawChessPiece(x, y, Black);
                }
            }
        };

        //棋子.
        var PlayerImageSrcList = [];
        var PlayerImageList = [];
        //设置棋子图片。
        Obj.SetPlayerImageSrcList = function(playerimagesrclist) {
            PlayerImageSrcList = [];
            PlayerImageSrcList.push('');
            for(var i = 0; i < playerimagesrclist.length; i ++) {
                PlayerImageSrcList.push(playerimagesrclist[i]);
            }            
        };
        Obj.LoadPlayerImageList = function(callback) {
            PlayerImageList = [];
            var n = PlayerImageSrcList.length - 1;
            for( var i = 1; i < PlayerImageSrcList.length; i++) {
                var img = new Image();
                img.src = PlayerImageSrcList[i];
                PlayerImageList[i] = img;
                PlayerImageList[i].onload = function() {
                    n--;
                    console.log('载入棋子图片。。。剩余'+n);
                    if( !n ) {
                        console.log('棋子图片载入完成。');
                        if( callback) {
                            callback();
                        } 
                    }
                }
            }
            return PlayerImageList.length;
        }
        /**
         * @return {boolean}
         */
        //绘制棋子。
        Obj.DrawChessPiece = function (x, y, player) {
            if (isNaN(x) || isNaN(y) || isNaN(player) ) {
                return false;
            }
            if (x < 0 || y < 0 || player < 0 ) {
                return false;
            }
            if (x > 25 || y > 25 ) {
                return false;
            }
            //画棋子
            CanvasContext.beginPath();
            var grd = CanvasContext.createRadialGradient(
                x * DisplaySize + BoardStartXY + DisplaySize/2 - DisplaySize / 6, 
                y * DisplaySize + BoardStartXY + DisplaySize/2 - DisplaySize / 6,
                0.5,
                x * DisplaySize + BoardStartXY + DisplaySize/2, 
                y * DisplaySize + BoardStartXY + DisplaySize/2,
                DisplaySize/2
            );
            if(player == Black) {
                grd.addColorStop(0, '#555');
                grd.addColorStop(0.9, '#222');
                CanvasContext.fillStyle = grd;
            } else if( player == White) {
                grd.addColorStop(0, '#eee');
                grd.addColorStop(0.9, '#bbb');
                CanvasContext.fillStyle = grd;
            }
            CanvasContext.arc(
                x * DisplaySize + BoardStartXY + DisplaySize/2, 
                y * DisplaySize + BoardStartXY + DisplaySize/2,
                DisplaySize/2, 0, 2*Math.PI);

            CanvasContext.fill();
            
            /*
            CanvasContext.drawImage(PlayerImageList[player],
                x * DisplaySize + BoardStartXY,
                y * DisplaySize + BoardStartXY,
                DisplaySize-1,
                DisplaySize-1);
            */
            return true;
        };
        //按图绘制。
        Obj.DrawChessPieceByMap = function(map) {
            if (map){
                for (var x = 0 ; x < GameSize; x ++ ) {
                    for (var y = 0 ; y < GameSize; y ++ ){
                        if (map[x][y].player )
                            Obj.DrawChessPiece(x, y, map[x][y].player);
                    }
                }
            }
        };

        //加载资源/初始化..
        Obj.Load = function (callback) {
            var n = 0;
            n = Obj.LoadBackgroundImageList(Obj.Draw);
            Obj.LoadPlayerImageList();
        };
        //绘制背景和棋盘。
        Obj.Draw = function () {            
            Obj.DrawBackgroundColor();
            Obj.DrawChessBoard();
        }
        //按图绘制全部。
        Obj.DrawByMap = function (map) {
            Obj.Draw();
            Obj.DrawChessPieceByMap(map);
        };
    }


/****************************************
 * 
 */

    //显示容器句柄
    var Display = null;
    //画棋盘句柄
    var Canvas = null;
    //棋盘显示控制句柄
    var HandleChessBoard = null;

    var HandleGame = null;

    //显示ID
    APP.DisplayId = display_id;
    APP.ApplyDisplayId = function() {

    }
    //显示尺寸基数设置
    APP.DisplaySize = DEFAULT_DISPLAY_SIZE;
    APP.ApplyDisplaySize = function() {
        HandleChessBoard.SetDisplaySize(APP.DisplaySize);
        HandleChessBoard.Draw();
    }

    //游戏玩家设置
    APP.PlayerSize = DEFAULT_GAME_PLAYER;
    APP.ApplyPlayerSize = function() {

    }

    //游戏大小设置
    APP.GameSize = DEFAULT_GAME_SiZE;
    APP.ApplyGameSize = function() {
        HandleChessBoard.SetGameSize(APP.GameSize);
        HandleChessBoard.Draw();
    }

    //棋谱设置
    APP.GameSgf = '';
    APP.ApplyGameSgf = function() {

    }

    //初始化
    Display = document.getElementById(APP.DisplayId);
    Canvas = document.createElement('canvas');
    Display.appendChild(Canvas);
    HandleChessBoard = new ChessBoardByCanvas(Canvas);
    HandleChessBoard.SetDisplaySize(APP.DisplaySize);
    HandleChessBoard.SetGameSize(APP.GameSize);

    HandleGame = new Game(APP.PlayerSize, new CellMap(APP.GameSize));



    HandleChessBoard.OnMove = function(x, y) {
        var point = new Point(x, y);
        if( HandleGame.Move(point) ) {
            HandleChessBoard.DrawByMap(HandleGame.GetNowMap().data);   
        }
        //console.log(HandleMove.GetLastMove().cellmap.Str());
        
    }    

    HandleChessBoard.Draw();
    //HandleChessBoard.DrawByMap(HandleMove.GetRoot().GetLast().cellmap.data);
}
