/** Image previewer */
class ImagePreviewer extends React.Component{
    constructor(props) {
        super(props);
        this.onImageLoad = this.onImageLoad.bind(this);
        this.imgHt = 0;
        this.imgWdt = 0;
        this.state = {imgLoaded: false, h: 0, w: 0};
    }
    componentDidMount() {
        
    }
    componentWillUnmount() {
        this.setState({imgLoaded: false});
    }
    onImageLoad({target:img}){
        this.setToAspectRatio(img);
    }
    /** Resize the uploaded image to fit the container */
    setToAspectRatio(img){
        /**Refactor */
        var maxWidth = 1000; // Max width for the image
        var maxHeight = 500;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        this.imgWdt = img.offsetWidth;    // Current image width
        this.imgHt = img.offsetHeight;  // Current image height

        // Check if the current width is larger than the max
        if(this.imgWdt > maxWidth){
            ratio = maxWidth / this.imgWdt;   // get ratio for scaling image
            img.style.width = maxWidth + 'px';
            img.style.height = this.imgHt * ratio + 'px';
            this.imgHt = this.imgHt * ratio;    // Reset height to match scaled image
            this.imgWdt = this.imgWdt * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if(this.imgHt > maxHeight){
            ratio = maxHeight / this.imgHt; // get ratio for scaling image
            img.style.width = this.imgWdt * ratio + 'px';
            img.style.height = maxHeight + 'px';
            this.imgWdt = this.imgWdt * ratio;    // Reset width to match scaled image
            this.imgHt = this.imgHt * ratio;    // Reset height to match scaled image
        }
        this.setState({imgLoaded: true, imgHeight: this.imgHt, imgWidth: this.imgWdt, imgLeft: img.offsetLeft, imgTop: img.offsetTop});
    }
    render(){
        if(!this.props.image){
            return null;
        }

        return <div class="image-previewer" id="image-previewer">
            <div class="ip-wrap">
                <div>
                    <img id="uploadedImg" onLoad={this.onImageLoad} src={this.props.image} />
                    {this.state.imgLoaded &&
                        <ImageCropper {...this.state} onImageSave={this.props.onImageSave}  />
                    }
                </div>
            </div>
        </div>
    }
}