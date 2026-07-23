const form = document.getElementById("optimize-form");
const loadingBox = document.getElementById("loading-box");

const titleResult = document.getElementById("title-result");
const descriptionResult = document.getElementById("description-result");
const tagsResult = document.getElementById("tags-result");
const thumbnailImage = document.getElementById("thumbnail-image");

const loadingItems = document.querySelectorAll(".loading-box li");

let currentStep = 0;

setInterval(() => {
    loadingItems.forEach(item => item.classList.remove("active"));
    loadingItems[currentStep].classList.add("active");

    currentStep++;
    if (currentStep >= loadingItems.length) {
        currentStep = 0;
    }
}, 700);

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabaseClient.auth.getUser();

if (!user) {
    alert("Please log in first.");
    return;
}

const { data: profile, error } = await supabaseClient
    .from("profiles")
    .select("plan, videos_used")
    .eq("id", user.id)
    .single();

if (error) {
    alert("Couldn't load your profile.");
    return;
}

if (profile.plan === "free" && profile.videos_used >= 3) {
    alert("🚫 You've reached your free limit of 3 optimizations. Upgrade to Pro for unlimited access.");
    return;
}

    loadingBox.style.display = "block";

    const topic = document.getElementById("topic").value;
    const category = document.getElementById("category").value;
    const audience = document.getElementById("audience").value;
    const language = document.getElementById("language").value;

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                topic,
                category,
                audience,
                language
            })
        });

        const data = await response.json();
        console.log("API Response:", data);

        loadingBox.style.display = "none";
        document.querySelector(".workspace-empty").style.display = "none";
document.querySelector(".workspace-results").style.display = "block";

        if (data.error) {
            alert(data.error);
            return;
        }

        titleResult.textContent = data.title;
        descriptionResult.textContent = data.description;
        tagsResult.textContent = data.tags;

        thumbnailImage.src = data.thumbnail;
        thumbnailImage.style.display = "block";

    } catch (err) {
        loadingBox.style.display = "none";
        alert("Something went wrong.");
        console.error(err);
    }
});
