import os, shutil
from flask import Flask, render_template, url_for, request, jsonify, session, jsonify
import json
import flask
from flask_dropzone import Dropzone
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class
import subprocess
from PIL import Image
from distutils.dir_util import copy_tree


app = Flask(__name__, static_folder="../client/dist", template_folder="../client", )
# SESSION_TYPE = 'redis'
app.config.from_object(__name__)

# Session(app)
dropzone = Dropzone(app)

# Dropzone settings
app.config['DROPZONE_UPLOAD_MULTIPLE'] = True
app.config['DROPZONE_ALLOWED_FILE_CUSTOM'] = True
app.config['DROPZONE_ALLOWED_FILE_TYPE'] = 'image/*'
app.config['DROPZONE_REDIRECT_VIEW'] = 'results'

# Uploads settings
app.config['UPLOADED_PHOTOS_DEST'] = os.getcwd() + '/uploads'
photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
patch_request_class(app)  # set maximum file size, default is 16MB

app.config['SECRET_KEY'] = 'supersecretkeygoeshere'

# Default Route
@app.route('/')
def index():
    return render_template("index.html")

# Image Upload
@app.route("/upload", methods=["POST"])
def upload():
    # list to hold our uploaded image urls
    # set session for image results
    if "file_urls" not in session:
        session['file_urls'] = []
    # list to hold our uploaded image urls
    file_urls = session['file_urls']
    if request.method == 'POST':
        file_obj = request.files
        for f in file_obj:
            file = request.files.get(f)
            # save the file with to our photos folder
            filename = photos.save(
                file,
                name=file.filename    
            )
            # append image urls
            file_urls.append(photos.url(filename))
            session['file_urls'] = file_urls
            # print ("Files",file)
            file_urls = session['file_urls']
    return "Loading"

# Process Image by OpenCV when Images Upload
@app.route("/processImage",methods=["POST","GET"])
def processImage():
    file_urls = session['file_urls']
    if file_urls:
        cmd = ["python", "removebkg.py"]
        p = subprocess.Popen(cmd, stdout = subprocess.PIPE,
                            stderr=subprocess.PIPE,
                            stdin=subprocess.PIPE)
        out,err = p.communicate()
        folder = './uploads'
        originalIMages = "../client/dist/outputImages/originalImages"
        copy_tree(folder, originalIMages)
        for the_file in os.listdir(folder):
            file_path = os.path.join(folder, the_file)
            print("DIR",the_file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                    #elif os.path.isdir(file_path): shutil.rmtree(file_path)
            except Exception as e:
                print(e)
        return "Data Processed"
    else:
        return "Something Went Wrong"            
    return "Process"

# Read Image file from Client Dist outputImages Directory

@app.route("/getoutputimages",methods=["GET"])
def getOutputImages():
    myImg = []
    outputfolder = '../client/dist/outputImages/outputImages'
    originalfolder = '../client/dist/outputImages/originalImages'
    # Output IMages
    for images in os.listdir(outputfolder):
        images = images
        im = Image.open("../client/dist/outputImages/outputImages/{}".format(images))
        width, height = im.size
        ratio = width / height
        width = float(width)
        height= float(height)
        finalRatio = width / height
        val={'images':images,'ratio':finalRatio}
        myImg.append(val)
    # Original Images
    originalImg = []
    for images in os.listdir(originalfolder):
        originalimages = images
        im = Image.open("../client/dist/outputImages/originalImages/{}".format(originalimages))
        width, height = im.size
        ratio = width / height
        width = float(width)
        height= float(height)
        finalRatio = width / height
        val={'originalimages':images,'originalratio':finalRatio}
        originalImg.append(val)
    return jsonify(myImg,originalImg)

@app.route("/deleteimage", methods=["POST"])
def deleteImage():
    data = request.get_json(silent=True)
    data = data['deleteIMageUrl']
    print('Data',data)
    os.remove("../client/dist/outputImages/outputImages/{}".format(data))
    data = data[:-4]
    print("DATA FINAL ORIGI",data)
    os.remove("../client/dist/outputImages/originalImages/{}".format(data))
    return 'Delete'

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5050)