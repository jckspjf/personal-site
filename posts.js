document.addEventListener("DOMContentLoaded", async () => {
    const path = window.location.pathname;
    const postId = path.split("/").pop().replace(".html", "");

    try {
        const index = await fetch("/posts.json").then(response => response.json());
        const posts = await Promise.all(index.posts.map(async id => ({
            id,
            post: await fetch(`/posts/${id}.json`).then(response => response.json())
        })));
        posts.sort((left, right) => Date.parse(right.post.date) - Date.parse(left.post.date));

        const postIndex = posts.findIndex(item => item.id === postId);

        if (postIndex === -1) return;

        const post = posts[postIndex].post;

        document.title = `${post.title} | an infinitesimal point in time, somewhere.`;

        document.querySelector(".mainHead").textContent = post.title;
        document.querySelector(".postDate").textContent = new Date(`${post.date}`).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC"
        });

        document.querySelector('meta[name="description"]')?.setAttribute("content", post.description);

        const setNavigation = (id, target, label) => {
            const element = document.getElementById(id);
            if (!element) return;

            if (target) {
                element.href = `/posts/${target}.html`;
            } else {
                element.hidden = true;
            }
        };

        const previous = posts[postIndex + 1]?.id;
        const next = posts[postIndex - 1]?.id;

        setNavigation("prevPost", previous);
        setNavigation("prevPostBottom", previous);
        setNavigation("nextPost", next);
        setNavigation("nextPostBottom", next);

        document.querySelector(".postDescription")?.remove();

        if (post.description) {
            const description = document.createElement("p");
            description.className = "postDescription";
            description.textContent = post.description;
            document.querySelector(".postHeader").appendChild(description);
        }

    } catch (error) {
        console.error("Failed to load post metadata:", error);
    }
});