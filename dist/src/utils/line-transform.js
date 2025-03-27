"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineTransform = exports.allowedExtensions = void 0;
const stream_1 = require("stream");
exports.allowedExtensions = ['.ts', '.png', '.jpg', '.webp', '.ico', '.html', '.js', '.css', '.txt'];
class LineTransform extends stream_1.Transform {
    constructor(baseUrl) {
        super();
        this.buffer = '';
        this.baseUrl = baseUrl;
    }
    _transform(chunk, encoding, callback) {
        const data = this.buffer + chunk.toString();
        const lines = data.split(/\r?\n/);
        this.buffer = lines.pop() || '';
        for (const line of lines) {
            const modifiedLine = this.processLine(line);
            this.push(modifiedLine + '\n');
        }
        callback();
    }
    _flush(callback) {
        if (this.buffer) {
            const modifiedLine = this.processLine(this.buffer);
            this.push(modifiedLine);
        }
        callback();
    }
    processLine(line) {
        if (line.endsWith('.m3u8') || line.endsWith('.ts')) {
            return `m3u8-proxy?url=${this.baseUrl}${line}`;
        }
        if (exports.allowedExtensions.some(ext => line.endsWith(ext))) {
            return `m3u8-proxy?url=${line}`;
        }
        return line;
    }
}
exports.LineTransform = LineTransform;
