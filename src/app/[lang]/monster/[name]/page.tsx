class Monster {
    lv: number;
    constructor(lv: number) {
        this.lv = lv;
    }
}

export default function Page({ params }: { params: { name: string } }) {
    return <div>My Post: {params.name}</div>
}