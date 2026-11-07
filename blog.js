document.addEventListener("DOMContentLoaded", async () => {
    const list = document.getElementById("postList");
    if (!list) return;

    try {
        const indexResponse = await fetch("/posts.json");
        if (!indexResponse.ok) throw new Error("Could not load post index");

        const index = await indexResponse.json();
        const posts = await Promise.all(index.posts.map(async id => {
            const response = await fetch(`/posts/${id}.json`);
            if (!response.ok) throw new Error(`Could not load post: ${id}`);
            return { id, ...await response.json() };
        }));

        posts.sort((left, right) => Date.parse(right.date) - Date.parse(left.date));
        list.replaceChildren();

        for (const post of posts) {
            const item = document.createElement("li");
            item.className = "blogEntry";

            const heading = document.createElement("h2");
            const link = document.createElement("a");
            link.href = `/posts/${encodeURIComponent(post.id)}.html`;
            link.textContent = post.title;
            heading.append(link);

            const date = document.createElement("time");
            date.dateTime = post.date;
            date.textContent = new Date(post.date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "America/New_York"
            });

            item.append(heading, date);

            if (post.description) {
                const description = document.createElement("p");
                description.textContent = post.description;
                item.append(description);
            }

            list.append(item);
        }

        if (posts.length === 0) {
            list.innerHTML = '<li class="blogStatus">No posts yet.</li>';
        }
    } catch (error) {
        console.error("Failed to load blog index:", error);
        list.innerHTML = '<li class="blogStatus">Posts could not be loaded.</li>';
    }
});