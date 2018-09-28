/** Image Cropper class with reset and save handlers */
class ImageCropper extends React.Component{
    constructor(props) {
        super(props);
        // console.log(this.props);
        this.state = {cropHeight: 0, cropWidth: 0};
        
        document.addEventListener('mousemove', this.onDocMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.onDocMouseUp.bind(this), false);
        
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        
        this.onCropHandleMouseDown = this.onCropHandleMouseDown.bind(this);
        this.onCropHandleMouseMove = this.onCropHandleMouseMove.bind(this);
        this.onCropHandleMouseUp = this.onCropHandleMouseUp.bind(this);
        
        this.dragStart = false;
        this.cropInitPos = {l:0, t:0, h: 0, w: 0};
        this.mousePos = {l: 0, t: 0};
        this.chDragStart = false;

        this.cropperEl = null;
        this.cropHandleType = null;
    }
    componentDidMount() {
        this.cropperEl = document.getElementById('image-cropper');
        this.setState({cropHeight: this.cropperEl.offsetHeight, cropWidth: this.cropperEl.offsetWidth});
    }
    componentWillUnmount() {
    }
    onDocMouseMove(e){
        if(this.chDragStart){
            this.onCropHandleMouseMove(e);
        }else if(this.dragStart){
            this.onMouseMove(e);
        }
    }
    onDocMouseUp(e){
        this.chDragStart = false;
        this.dragStart = false;
        this.getCropInitPos();

        this.cropperEl.style.right = 'auto';
        this.cropperEl.style.left = this.cropInitPos.l + 'px';
        this.cropperEl.style.bottom = 'auto';
        this.cropperEl.style.top = this.cropInitPos.t + 'px';

        this.cropHandleType = null;
    }
    /** Gets initial cropper position during mousedown */
    getCropInitPos(){
        this.cropInitPos.l = Math.max(this.cropperEl.offsetLeft, 1);
        this.cropInitPos.t = Math.max(this.cropperEl.offsetTop, 1);
        this.setState({cropHeight: this.cropperEl.offsetHeight, cropWidth: this.cropperEl.offsetWidth});
    }
    onCropHandleMouseDown(e, type){
        e.stopPropagation();
        if(type){
            this.cropHandleType = type;
        }
        this.dragStart = false;
        this.chDragStart = true;
        this.mousePos = {l: e.clientX, t: e.clientY};
        
        this.getCropInitPos();
        //TODO: find more generic solution
        //Adjust the style coordinates to set the cropper in same position
        //For topleft handle
        if(type === 'lt'){
            this.cropperEl.style.right = (this.props.imgWidth - this.cropInitPos.l - this.state.cropWidth) + 'px';
            this.cropperEl.style.left = 'auto';
            this.cropperEl.style.bottom = (this.props.imgHeight - this.cropInitPos.t - this.state.cropHeight) + 'px';
            this.cropperEl.style.top = 'auto';
        }else if(type === 'rb'){//For right bottom handle
            this.cropperEl.style.right = 'auto';
            this.cropperEl.style.left = this.cropInitPos.l + 'px';
            this.cropperEl.style.bottom = 'auto';
            this.cropperEl.style.top = this.cropInitPos.t + 'px';
        }
        
    }
    onCropHandleMouseMove(e, type){
        e.stopPropagation();
        type = type || this.cropHandleType;
        if(this.chDragStart){
            var cropperEl = this.cropperEl;

            var deltaL = this.mousePos.l - e.clientX,
                deltaY = this.mousePos.t - e.clientY;

            var containerDim = this.props;
            var cropperDeltaL = type === 'lt'? (this.state.cropWidth + deltaL) : (this.state.cropWidth - deltaL);
            //console.log(deltaL, deltaY, cropperDeltaL, this.cropInitPos.l, containerDim.w);
            //Min width should be 25 px and max width as 800px
            //Should not expand beyond the width of image
            //Should not go left side of image 
            if((cropperDeltaL > 25 && cropperDeltaL <= 800)
                && (type === 'lt'? (cropperDeltaL < containerDim.imgWidth): (cropperDeltaL + this.cropInitPos.l) < containerDim.imgWidth )
                && (this.cropInitPos.l) > 0){
                cropperEl.style.width = cropperDeltaL + 'px';
                this.cropInitPos.l = cropperEl.offsetLeft;
            }

            var cropperDeltaY = type === 'lt'? (this.state.cropHeight + deltaY) : this.state.cropHeight - deltaY;
            //Min width should be 25 px and max width as 100px
            if((cropperDeltaY > 25 && cropperDeltaY <= 100) 
                && (cropperDeltaY + this.cropInitPos.t) < (containerDim.imgHeight)
                && (this.cropInitPos.t) > 0){
                cropperEl.style.height = cropperDeltaY + 'px';
                this.cropInitPos.t = cropperEl.offsetTop;
            }
        }
    }
    onCropHandleMouseUp(e){
        this.chDragStart = false;
    }
    onMouseDown(e){
        var el = e.target;
        this.dragStart = true;
        this.mousePos = {l: e.clientX, t: e.clientY};
        this.getCropInitPos();
    }

    onMouseMove(e){
        e.stopPropagation();
        if(this.dragStart){
            
            var deltaL = this.mousePos.l - e.clientX, 
                deltaY = this.mousePos.t - e.clientY;

            var containerDim = this.props;//this.props.containerDim;
            var cropperDeltaL = (this.cropInitPos.l - deltaL);
            if(cropperDeltaL > 0 && (cropperDeltaL + this.state.cropWidth) < containerDim.imgWidth){
                this.cropperEl.style.left = cropperDeltaL + 'px';
            }

            var cropperDeltaY = this.cropInitPos.t - deltaY;
            // console.log(cropperDeltaY, this.cropInitPos, this.state.cropHeight, containerDim);
            if(cropperDeltaY > 0 && (cropperDeltaY + this.state.cropHeight) < (containerDim.imgHeight)){
                this.cropperEl.style.top = cropperDeltaY + 'px';
            }
        }else if(this.chDragStart){
            this.onCropHandleMouseMove(e);
        }
    }
    onMouseUp(e){
        if(this.dragStart){
            var el = e.target;
            // console.log('Up: ', el.offsetLeft, el.offsetTop);
            this.mousePos = {l: e.clientX, t: e.clientY};
            this.dragStart = false;
        }
    }
    render(){
        return <div>
        <div class="logger">{this.state.cropWidth}X{this.state.cropHeight}</div>
        <div class="image-cropper-wrap">
            <div class="image-cropper" id="image-cropper" onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp} style={{ maxWidth: this.props.imgWidth + 'px', maxHeight: this.props.imgHeight + 'px', top: this.props.imgTop/*, left: this.props.imgLeft*/}}>
                <div id="ic-left-top" onMouseDown={(e) => this.onCropHandleMouseDown(e, 'lt')} onMouseMove={(e) => this.onCropHandleMouseMove(e, 'lt')} onMouseUp={(e) => this.onCropHandleMouseUp(e, 'lt')}></div>
                <div id="ic-left-middle" class="dis"></div>
                <div id="ic-left-bottom" class="dis"></div>
                <div id="ic-center-top" class="dis"></div>
                <div id="ic-center-bottom" class="dis"></div>
                <div id="ic-right-top" class="dis"></div>
                <div id="ic-right-middle" class="dis"></div>
                <div id="ic-right-bottom" onMouseDown={(e) => this.onCropHandleMouseDown(e, 'rb')} onMouseMove={(e) => this.onCropHandleMouseMove(e, 'rb')} onMouseUp={(e) => this.onCropHandleMouseUp(e, 'rb')}></div>
            </div>
        </div>
        </div>
    }
}