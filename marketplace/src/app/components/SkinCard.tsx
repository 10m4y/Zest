type Skin = {
  id: number
  name: string
  price: string
  image: string
}

type SkinCardProps = {
  skin: Skin
}

export function SkinCard({ skin }: SkinCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={skin.image || "/placeholder.svg"} alt={skin.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{skin.name}</h3>
        <p className="text-sm text-gray-500">{skin.price} ETH</p>
      </div>
      <div className="px-4 pb-4">
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Buy Now</button>
      </div>
    </div>
  )
}

