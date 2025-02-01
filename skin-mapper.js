export function generateMetadata() {
  const image_urls = [
    "https://gateway.pinata.cloud/ipfs/bafkreidnt4fcdokrw5pterkwapf4mfqxnqq7smexmauomeyynptfrek66y",
    "https://gateway.pinata.cloud/ipfs/bafkreiebl7cxougnm7p6cezszceu4ujjitouoyqxyevaedpqvcdlcoc5gq",
    "https://gateway.pinata.cloud/ipfs/bafkreihv7ybxjwszcmxdzkhxbzmu3lkaz6mumbufyqrkplhbiq52rzlhgy",
    "https://gateway.pinata.cloud/ipfs/bafkreihbzx4wkqtko4noolcwrdfdwwfuzkiiq6lvgyeb6xgmvxxlyooicy",
  ];

  const names = ["skin_woman", "skin_adventurer", "skin_orc", "skin_robot"];

  const descriptions = [
    "A brave warrior with unmatched skill.",
    "An adventurous traveler seeking treasures.",
    "A fierce orc with immense strength.",
    "A futuristic robot with advanced AI.",
  ];

  const metadata = {};

  for (let i = 0; i < image_urls.length; i++) {
    const id = i;
    metadata[image_urls[i]] = {
      id: id,
      name: names[i],
      description: descriptions[i],
      rarity: Math.random().toFixed(2),
      scale: 1.0,
      market_uri: "http://localhost:3000",
    };
  }

  return metadata;
}