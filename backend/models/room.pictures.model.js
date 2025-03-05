import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    length: { type: Number, required: true },
    chunkSize: { type: Number, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Room" }
}, { timestamps: true })

const pictureChunksSchema = mongoose.Schema({
    files_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Picture"
    },
    n: { type: Number, required: true },
    data: { type: Buffer, required: true },
}, { timestamps: true })

const Picture = mongoose.model("Picture", pictureSchema);
const PictureChunk = mongoose.model("PictureChunk", pictureChunksSchema)

export { Picture, PictureChunk }