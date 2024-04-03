export default function Page({ params }: { params: { name: string } }) {
    return <div>怪物名称: {params.name}</div>
}