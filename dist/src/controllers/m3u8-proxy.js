"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.m3u8Proxy = void 0;
const axios_1 = __importDefault(require("axios"));
const line_transform_1 = require("../utils/line-transform");
const m3u8Proxy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.query.url;
        if (!url)
            return res.status(400).json("url is required");
        const isStaticFiles = line_transform_1.allowedExtensions.some(ext => url.endsWith(ext));
        const baseUrl = url.replace(/[^/]+$/, "");
        const response = yield axios_1.default.get(url, {
            responseType: 'stream',
            headers: { Accept: "*/*", Referer: "https://megacloud.club/" }
        });
        const headers = Object.assign({}, response.headers);
        if (!isStaticFiles)
            delete headers['content-length'];
        res.cacheControl = { maxAge: headers['cache-control'] };
        res.set(headers);
        if (isStaticFiles) {
            return response.data.pipe(res);
        }
        const transform = new line_transform_1.LineTransform(baseUrl);
        response.data.pipe(transform).pipe(res);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
});
exports.m3u8Proxy = m3u8Proxy;
