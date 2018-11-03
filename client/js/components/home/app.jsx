import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import ImagePalette from 'react-image-palette'
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import GridList from '@material-ui/core/GridList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import './styles.css';


const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
}

const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            outputImages: undefined,
            originalIMages: undefined,
            loading: false,
            openSnackbar: false,
            verticalSnackbar: 'top',
            horizontalSnackbar: 'center',
            dialogOpen: false,
            deleteImage: undefined,
            checking:undefined
        };
        this.uploadImage = this.uploadImage.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);
        // this.deleteDialogOpen = this.deleteDialogOpen.bind(this);
        this.deleteDialogClose = this.deleteDialogClose.bind(this);

    }

    onDrop(files) {
        this.setState({
            files: files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
        });
        const file = this.state.files
        // console.log("My console", file[0].file)
    }
    // ComponentWil Mount
    componentWillMount() {
        axios.get("/getoutputimages").then((res) => {
            let outputImage = res.data
            console.log("Output Dtass", outputImage)
            this.setState({
                outputImages: outputImage[0],
                loading: false,
                dialogOpen: false,
                originalIMages: outputImage[1],
            })
            var myarray = [];
            // for(let value in outputImage){
            //     for(let val in outputImage){
            //         let check = Object.values(outputImage[val])
            //         // console.log("Checks",check.images)
            //         let original = check[value] 
            //         // console.log("Checks",original.images)
            //         var myobj = {
            //             original : original.originalimages,
            //             output : original.images
            //         }
            //         console.log('checkss',myobj)
            //         myarray.push(original)
            //     }
            // }
            // console.log('mY final array',myarray)
            // myarray.map((val,key)=>{
            //     console.log("My map  va;",val)
            // })
            // outputImage[1].map((val,key)=>{
            //     console.log("My 1 obj assign",val.originalimages)
            //     let originalimages = val.originalimages
            //     let originalratio = val.originalratio 
            //     this.state.outputImages.map(function(el) {
            //         const object2 = Object.assign({
            //             c: 3,
            //             d: originalimages
            //           });
            //           console.log("OBJECT2",object2)
            //          this.state.checking = originalimages
            //         // var o = Object.assign({}, el);
            //         // o.originalimages = originalimages;
            //         // o.originalratio = originalratio
            //       })
            //       console.log('Stateee',this.state)
            // })
//             var a = ["a","b","c"],
//     b = ["A","B","C"],
//     c = [1,2,3],
//     output = "",
//     i;
// for (i = 0; i < a.length; i += 1) {
//     output += a[i] + b[i] + c[i] + "\n";
//     console.log('Outputs',output)
// }
             var outputimage = outputImage[0]
             var originalimage = outputImage[1]
             var output = undefined
            for (var a = 0; a < outputimage.length; a += 1){
                // output += outputImage[a].images + originalimage[a] 
                console.log("OUTPUTA",outputImage[a].images,'Other',originalimage[a])
            }
            console.log('HELLLLLO',this.state.checking)
            // for(let value in outputImage){
            //     console.log('ALLLLL vall', outputImage[value].images)
            //     // outputImage[value].map((val,key)=>{
            //     //    console.log("My loop values",val.images)
            //     // })
            // }
            // console.log("Output nnn",outputImage[0],'Other nn',outputImage[1])
            // outputImage.map((val,key)=>{
            //     console.log("Valssssssssue",val)
                // val.map((val,key)=>{
                //     var outputAndOriginalImage = {
                //         images : val.images,
                //         orignalImage : val.originalimages
                //     }
                //     console.log("OutandInput Image mix",outputAndOriginalImage)
                // })
            // })
        })
    }
    // ComponentDidmount 
    componentDidMount() {
        axios.get("/getoutputimages").then((res) => {
            let outputImage = res.data
            console.log("Output Dta", outputImage)
            this.setState({
                outputImages: outputImage[0],
                loading: false,
                dialogOpen: false,
                originalIMages: outputImage[1],
            })
        })
    }
    componentWillUnmount() {
        // Make sure to revoke the data uris to avoid memory leaks
        const { files } = this.state;
        for (let i = files.length; i >= 0; i--) {
            const file = files[0];
            URL.revokeObjectURL(file.preview);
        }
    }

    uploadImage() {
        // Upload Images
        const files = this.state.files
        const uploaders = files.map(file => {
            // Initial FormData
            console.log('IMP file', file.file)
            const formData = new FormData();
            formData.append("file", file.file);
            formData.append("tags", `codeinfuse, medium, gist`);
            formData.append("upload_preset", "pvhilzh7"); // Replace the preset name with your own
            formData.append("api_key", "1234567"); // Replace API key with your own Cloudinary key
            formData.append("timestamp", (Date.now() / 1000) | 0);

            // Make an AJAX upload request using Axios (replace Cloudinary URL below with your own)
            var a = 's'
            return axios.post("/upload", formData, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            }).then(response => {
                const data = response.data;
                if (data === "Loading") {
                    this.setState({
                        loading: true
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })
        });
        // Process Images
        axios.get("/processImage").then((res) => {
            this.setState({
                files: []
            })
            var data = res.data
            if (data) {
                axios.get("/getoutputimages").then((res) => {
                    let outputImage = res.data
                    console.log("Output Dta", outputImage)
                    this.setState({
                        outputImages: outputImage[0],
                        loading: false,
                        originalIMages: outputImage[1],
                    })
                })
            }
            else {
                console.log('Something Went Wrong')
            }
        })
    }
    // Copy to ClipBoard
    copyColor(ev) {
        navigator.clipboard.writeText(ev)
        this.setState({
            openSnackbar: true
        })
        setTimeout(() => {
            this.setState({
                openSnackbar: false
            })
        }, 1000)

    }

    // Close Snackbar
    closeSnackbar() {
        this.setState({
            openSnackbar: false
        })
    }
    // Image show in New Tab
    imgShowTab(ev) {
        console.log('my val', ev)
        let path = "/dist/outputImages/outputImages/"
        let imagePreview = path + ev
        var win = window.open(ev, '_blank');
        win.focus();
    }
    //  Open Delete Image Dialaog
    deleteDialogOpen(ev) {
        this.setState({
            dialogOpen: true,
            deleteImage: ev
        })
    }
    // Close Delete Image Dialog
    deleteDialogClose() {
        this.setState({
            dialogOpen: false
        })
    }

    // Delete Image
    deleteImage(ev) {
        let deleteIMageUrl = this.state.deleteImage
        axios.post(`/deleteimage`, { deleteIMageUrl }).then((res => {
            let data = res.data
            if (data) {
                axios.get("/getoutputimages").then((res) => {
                    let outputImage = res.data
                    console.log("Output Dta", outputImage)
                    this.setState({
                        outputImages: outputImage[0],
                        loading: false,
                        dialogOpen: false,
                        originalIMages: outputImage[1]
                    })
                })
            }
        }))
    }
    render() {
        const { files } = this.state;

        const thumbs = files.map(file => (
            <div style={thumb}>
                <div style={thumbInner}>
                    <img
                        src={file.preview}
                        style={img}
                    />
                </div>
            </div>
        ));
        const { loading, outputImages, openSnackbar, verticalSnackbar, horizontalSnackbar, originalIMages } = this.state
        console.log('state data', this.state.outputImages)
        const path = "/dist/outputImages/outputImages/"
        const originalPath = "/dist/outputImages/originalImages/"
        return (
            // <Paper elevation={1}>
            <div>
                <div>
                    {/* Snackbar to copy Text*/}
                    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={openSnackbar} SnackbarContentProps={{ 'aria-describedby': 'message-id', }} message={<span id="formchecking">Color Copied to Clipboard</span>} />
                    <Typography variant="h4" id="typographyUpload">
                        <b id="ImageUploadText">Upload your Multiple Images</b> <br />
                        Drop your Image or either Select it.
                    </Typography>
                    <section id="uploadSection">
                        <div className="dropzone">
                            <Dropzone
                                accept="image/*"
                                onDrop={this.onDrop.bind(this)}
                            />
                        </div>
                        <aside style={thumbsContainer}>
                            {thumbs}
                        </aside>
                        <Button variant="outlined" color="primary" id="uploadBtn" onClick={this.uploadImage}>
                            Upload
                            <CloudUploadIcon />
                        </Button>
                    </section>
                    <Typography variant="h4" id="typogragphyOutput">
                        {
                            (outputImages) ?
                                <b id="ImageOutputText">Output Images</b>
                                :
                                <b id="ImageOutputText">Image Not Found</b>
                        }
                    </Typography>
                    {/* Show Output Images */}

                    {
                        (loading) ?
                            <div className="loader">
                                <CircularProgress size={70} />
                            </div>
                            :
                            <div>
                                {/* <GridList cellHeight={400} className="gridList"> */}
                                {
                                    (outputImages) ?
                                        outputImages.map((val, key) => {
                                            return (
                                                <div>
                                                <GridList cellHeight={450} className="gridList">
                                                        <Card className="card" key={key}>
                                                            <CardActionArea>
                                                                <CardMedia
                                                                    component="img"
                                                                    alt="Contemplative Reptile"
                                                                    className="media"
                                                                    height="240"
                                                                    image={path + val.images}
                                                                    title="Contemplative Reptile"
                                                                />
                                                                <CardContent>
                                                                <Typography gutterBottom variant="h5" component="h2">
                                                                    OpenCV Output
                                                                </Typography>
                                                                    <Typography gutterBottom variant="h6" component="h2">
                                                                        Color Plattee
                                                                </Typography>
                                                                    <ImagePalette image={path + val.images}>
                                                                        {({ backgroundColor, color, alternativeColor }) => (
                                                                            <div>
                                                                                <Tooltip title={backgroundColor} placement="left">
                                                                                    <span onClick={this.copyColor.bind(this, backgroundColor)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: backgroundColor }}></span>
                                                                                </Tooltip>
                                                                                <Tooltip title={color} placement="top">
                                                                                    <span onClick={this.copyColor.bind(this, color)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: color }}></span>
                                                                                </Tooltip>
                                                                                <Tooltip title={alternativeColor} placement="right">
                                                                                    <span onClick={this.copyColor.bind(this, alternativeColor)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: alternativeColor }}></span>
                                                                                </Tooltip>
                                                                            </div>
                                                                        )}
                                                                    </ImagePalette>
                                                                    <Typography variant="h6">Ratio:{val.ratio.toFixed(2)}</Typography>
                                                                    <div>
                                                                    </div>
                                                                </CardContent>
                                                            </CardActionArea>
                                                            <CardActions>
                                                                {/* Dialog */}
                                                                <Dialog
                                                                    open={this.state.dialogOpen}
                                                                    onClose={this.deleteDialogClose}
                                                                    aria-labelledby="alert-dialog-title"
                                                                    aria-describedby="alert-dialog-description"
                                                                >
                                                                    <DialogTitle id="alert-dialog-title">Delete Image?</DialogTitle>
                                                                    <DialogContent>
                                                                        <DialogContentText id="alert-dialog-description">
                                                                            Are you sure you want to delete this image?
                                                                </DialogContentText>
                                                                    </DialogContent>
                                                                    <DialogActions>
                                                                        <Button onClick={this.deleteDialogClose} autoFocus color="primary">
                                                                            Close
                                                                    </Button>
                                                                        <Button onClick={this.deleteImage.bind(this, val.images)} color="secondary">
                                                                            Delete
                                                                    </Button>
                                                                    </DialogActions>
                                                                </Dialog>
                                                                <Button size="medium" onClick={this.imgShowTab.bind(this, path + val.images)} color="primary">
                                                                    Preview
                                                            </Button>
                                                                <Button size="small" color="primary">
                                                                    <a href={path + val.images} download>Direct Download</a>
                                                                </Button>
                                                                <IconButton onClick={this.deleteDialogOpen.bind(this, val.images)} aria-label="Delete">
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </CardActions>
                                                        </Card>
                                                    {/* Original Image*/}
                                        <Card className="card">
                                            <CardActionArea>
                                                <CardMedia
                                                    component="img"
                                                    alt="Original Image"
                                                    className="media"
                                                    height="240"
                                                    image={originalPath + originalIMages[key].originalimages}
                                                    title="Original Image"
                                                />
                                                <CardContent>
                                                <Typography gutterBottom variant="h5" component="h2">
                                                        Original Image
                                                    </Typography>
                                                    <Typography gutterBottom variant="h6" component="h2">
                                                        Color Plattee
                                                    </Typography>
                                                    <ImagePalette image={originalPath + originalIMages[key].originalimages}>
                                                        {({ backgroundColor, color, alternativeColor }) => (
                                                            <div>
                                                                <Tooltip title={backgroundColor} placement="left">
                                                                    <span onClick={this.copyColor.bind(this, backgroundColor)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: backgroundColor }}></span>
                                                                </Tooltip>
                                                                <Tooltip title={color} placement="top">
                                                                    <span onClick={this.copyColor.bind(this, color)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: color }}></span>
                                                                </Tooltip>
                                                                <Tooltip title={alternativeColor} placement="right">
                                                                    <span onClick={this.copyColor.bind(this, alternativeColor)} style={{ width: 30, height: 30, display: 'inline-block', backgroundColor: alternativeColor }}></span>
                                                                </Tooltip>
                                                            </div>
                                                        )}
                                                    </ImagePalette>
                                                    <Typography variant="h6">Ratio:{originalIMages[key].originalratio.toFixed(2)}</Typography>
                                                    <div>
                                                    </div>
                                                </CardContent>
                                            </CardActionArea>
                                            <CardActions>
                                                {/* Dialog */}
                                                <Dialog
                                                    open={this.state.dialogOpen}
                                                    onClose={this.deleteDialogClose}
                                                    aria-labelledby="alert-dialog-title"
                                                    aria-describedby="alert-dialog-description"
                                                >
                                                    <DialogTitle id="alert-dialog-title">Delete Image?</DialogTitle>
                                                    <DialogContent>
                                                        <DialogContentText id="alert-dialog-description">
                                                            Are you sure you want to delete this image?
                                                            Note: It will delete Original and Output Image
                                                        </DialogContentText>
                                                    </DialogContent>
                                                    <DialogActions>
                                                        <Button onClick={this.deleteDialogClose} autoFocus color="primary">
                                                            Close
                                                        </Button>
                                                        <Button onClick={this.deleteImage.bind(this, val.images)} color="secondary">
                                                            Delete
                                                        </Button>
                                                    </DialogActions>
                                                </Dialog>
                                                <Button size="medium" onClick={this.imgShowTab.bind(this, originalPath + originalIMages[key].originalimages)} color="primary">
                                                    Preview
                                                </Button>
                                                <Button size="small" color="primary">
                                                    <a href={originalPath + originalIMages[key].originalimages} download>Direct Download</a>
                                                </Button>
                                                <IconButton onClick={this.deleteDialogOpen.bind(this, val.images)} aria-label="Delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                        </GridList>
                                                    </div>
                                            )
                                        })
                                        :
                                        <div></div>
                                }
                                {/* </GridList> */}
                            </div>
                            }

                </div>
            </div>
            // </Paper>
        )
    }

}
export default App;