export default async function handler(req, res) {
  return res.status(200).json({
    title: "Test Title",
    description: "Test Description",
    tags: "tag1, tag2, tag3",
    thumbnail: "https://placehold.co/600x340"
  });
}
