export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "What Is Web Development?",
      date: "27 Oct 2026",
      excerpt:
        "Web development describes the work involved in designing, building, and maintaining websites and web applications.",
    },
    {
      id: 2,
      title: "How Many Types Of SEO Are There?",
      date: "05 Dec 2026",
      excerpt: "A quick summary of the main categories of SEO and the benefits each one brings.",
    },
    {
      id: 3,
      title: "Why Businesses Need A Digital Strategy",
      date: "18 Jan 2026",
      excerpt: "Digital marketing brings together many moving pieces that work together to close sales.",
    },
  ];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Blog</h1>
          <p>News & updates from the Wirecto team.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-3">
            {posts.map((post) => (
              <div className="card" key={post.id}>
                <span className="eyebrow">{post.date}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
