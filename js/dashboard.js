document.addEventListener("DOMContentLoaded", async () => {

    const {
        data: { session }
    } = await window.supabaseClient.auth.getSession();

    if (!session) {

        window.location.href = "login.html";
        return;

    }

    const user = session.user;

    const { data: profile, error } = await window.supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();



    if (error) {

        console.error(error);
        return;

    }

    document.getElementById("welcome-name").textContent =
        `Welcome Back, ${profile.full_name} 👋`;

    document.getElementById("profile-name").textContent =
        profile.full_name;

    document.getElementById("plan").textContent =
        profile.plan;

    const limit =
        profile.plan === "Free"
            ? 3
            : "∞";

    document.getElementById("usage").textContent =
        `${profile.videos_used} / ${limit} Optimizations`;

});
