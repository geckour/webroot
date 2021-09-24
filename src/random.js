class Random {
    constructor(seed) {
        this.x = 561957821468;
        this.y = 178418972369;
        this.z = 825678645105;
        this.w = seed;
    }
    
    // XorShift
    next() {
        const t = this.x ^ (this.x << 11)
        this.x = this.y; this.y = this.z; this.z = this.w
        return Math.abs(this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)))
    }

    nextInt(min, max) {
        const r = Math.abs(this.next());
        return min + (r % (max + 1 - min));
    }
}

export { Random }