/** Base class for cropping module */
class KlinifyCropper extends React.Component{
    constructor(props) {
        super(props);
        this.onImageSelect = this.onImageSelect.bind(this);
        this.onClearImage = this.onClearImage.bind(this);
        this.onImageSave = this.onImageSave.bind(this);
        this.printImage = this.printImage.bind(this);
        this.fileInput = React.createRef();
        this.state = {image: null, savedImage: null, enablePrint: false};
      }
      onImageSelect(event) {
        event.preventDefault();
        const file = event.target.files[0];
        const size = file.size / Math.pow(1024,2);
        if(size > 1){
            alert('Please select an image of size less than 1Mb.');
            return null;
        } 
        this.setState({image: URL.createObjectURL(file)});
    }
    
    onClearImage(){
        this.setState({image: null, savedImage: null, enablePrint: false});
    }
    /** After cropping and saving */
    onImageSave(){
        if(this.state.image){
            var t = this;
            this.saveImage().then(function(res){
                t.setState({savedImage: res, enablePrint: true});
            });
        }else{
            this.setState({enablePrint: true});
        }
    }
    saveImage(imageFile) {
        return Promise.resolve("https://source.unsplash.com/collection/1163637/800x100");
        // return Promise.resolve("http://lorempixel.com/800/100/cats/");
    }
    printImage(e){
        //Create HTML content for new tab for printing
        var html = '<title>Klinify Image Cropper</title><h1>Klinify Image Cropper</h1>';
        //If it has image, use print onload of the image, else print on load of document
        if(this.state.savedImage){
            html += '<img onload="window.print();window.close();" src="'+this.state.savedImage+'" style="max-height:100px;"/>';
        }
        var win = window.open('', 'name_' + Math.random(), 'left=0,top=0,width=800,height=600,toolbar=0,scrollbars=0,status=0');
        var container = document.createElement('div');
        container.innerHTML = html;
        
        win.document.body.appendChild(container);
        win.document.close();
        if(!this.state.savedImage){
            win.focus();
            win.print();
            win.close();
        }
    }
    render(){
        let previewDisabled = !this.state.enablePrint ? {'disabled' : 'disabled'} : {};

        return <div class="klinify-cropper">
            <label id="file-select">
                <input  ref={this.fileInput} onChange={this.onImageSelect} type="file" accept="image/*"/>
                Select an image
            </label>
            <br/><br/>
            <ImagePreviewer image={this.state.image}/>
            <br/>
            {
                this.state.image &&
                <button type="button" onClick={this.onClearImage}>Clear</button>
            }
            <button type="button" {...previewDisabled} onClick={this.printImage}>Print Preview</button>
            <button type="button" onClick={this.onImageSave}>Save</button>
        </div>
    }
}

ReactDOM.render(
    <KlinifyCropper />,
    document.getElementById('root')
);