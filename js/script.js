const API_URL = "https://api.github.com/users/"

const main = document.getElementById("main")
const searchBox = document.getElementById("search")
const searchBtn = document.getElementById("search-btn")
const latestRepo = document.getElementsByClassName("latest-repos-area")[0]
const boxSection = document.getElementsByClassName("box-section")[0]
const listSection = document.getElementsByClassName("list-section")[0]
const leftSection = document.getElementsByClassName("left-section")[0]
const contributeArea = document.getElementsByClassName("contribute-area")[0]
const loadingScreen = document.getElementsByClassName("loading-screen")[0]
const userInfoArea = document.getElementsByClassName("user-info-area")[0]

const getUser = async (username) => {
    try {
        const response = await fetch(API_URL + username)

        while (boxSection.firstChild) {
            boxSection.removeChild(boxSection.firstChild)
        }
        while (listSection.firstChild) {
            listSection.removeChild(listSection.firstChild)
        }
        while (leftSection.firstChild) {
            leftSection.removeChild(leftSection.firstChild)
        }
        while (contributeArea.firstChild) {
            contributeArea.removeChild(contributeArea.firstChild)
        }
        // const response = await fetch(API_URL + username)
        const data = await response.json()

        const imgDiv = document.createElement("div")
        imgDiv.classList.add("user-image")
        const image = document.createElement("img")
        image.src = data.avatar_url
        image.alt = "Alternative text"
        image.width = 200
        image.height = 200

        const viewPage = document.createElement("a")
        viewPage.classList.add("user-image")
        viewPage.innerText = "View Page"
        viewPage.href = data.html_url

        const contributeGraph = document.createElement("div")
        contributeGraph.classList.add("contribute-graph-image")
        const graphimage = document.createElement("img")
        graphimage.src = `https://ghchart.rshah.org/${username}`
        graphimage.alt = "Graph Alternative text"

        imgDiv.appendChild(image)
        leftSection.appendChild(imgDiv)
        leftSection.appendChild(viewPage)
        contributeGraph.appendChild(graphimage)
        contributeArea.appendChild(contributeGraph)

        const info1 = document.createElement("ul")
        const publicRepos = document.createElement("li")
        const publicGists = document.createElement("li")
        const followers = document.createElement("li")
        const following = document.createElement("li")
        publicGists.innerText = `Public Gists: ${data.public_gists}`
        info1.appendChild(publicGists)
        publicRepos.innerText = `Public Repos: ${data.public_repos}`
        info1.appendChild(publicRepos)
        followers.innerText = `Followers: ${data.followers}`
        info1.appendChild(followers)
        following.innerText = `Following: ${data.following}`
        info1.appendChild(following)
        boxSection.appendChild(info1)

        const info2 = document.createElement("ul")
        const company = document.createElement("li")
        const blog = document.createElement("li")
        const location = document.createElement("li")
        const createdAt = document.createElement("li")
        company.innerText = `Company: ${data.company}`
        info2.appendChild(company)
        blog.innerText = `Blog/website: ${data.blog}`
        info2.appendChild(blog)
        location.innerText = `Location: ${data.location}`
        info2.appendChild(location)
        createdAt.innerText = `Since: ${data.created_at}`
        info2.appendChild(createdAt)
        listSection.appendChild(info2)

        // console.log(`${data.bio}`)

        getRepos(username)
        console.log(data)
    } catch (error) {
        console.log(error.response.status)
        if (error.response.status == 404) {
            createErrorCard("No profile with this Username")
        }
    }
}
// init call
// getUser("bearwithpy")

const getRepos = async (username) => {
    try {
        // const repos = document.getElementById("repo")
        const response = await fetch(API_URL + username + "/repos")
        const data = await response.json()

        while (latestRepo.firstChild) {
            latestRepo.removeChild(latestRepo.firstChild)
        }

        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const recentRepos = data.slice(0, 5)

        const ul = document.createElement("ul")

        recentRepos.map((item) => {
            const li = document.createElement("li")
            const elem = document.createElement("a")
            elem.classList.add("repo")
            elem.href = item.html_url
            elem.innerText =
                item.name +
                ` stars: ${item.stargazers_count} watcher: ${item.watchers_count} forks: ${item.forks_count}`
            elem.target = "_blank"

            li.appendChild(elem)
            ul.appendChild(li)
        })

        latestRepo.appendChild(ul)
    } catch (error) {
        console.log(error)
        createErrorCard("No profile with this Username")
    }
}

const formSubmit = (e) => {
    if (searchBox.value != "") {
        getUser(searchBox.value)
        searchBox.value = ""
    }
    return false
}

form.addEventListener("submit", function (event) {
    event.preventDefault()
})

searchBtn.addEventListener("click", (e) => {
    formSubmit()
})

searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault()
        formSubmit()
    }
})

searchBox.addEventListener("focusout", () => {
    formSubmit()
})

const createErrorCard = (msg) => {
    while (boxSection.firstChild) {
        boxSection.removeChild(boxSection.firstChild)
    }
    while (listSection.firstChild) {
        listSection.removeChild(listSection.firstChild)
    }
    while (leftSection.firstChild) {
        leftSection.removeChild(leftSection.firstChild)
    }
    while (contributeArea.firstChild) {
        contributeArea.removeChild(contributeArea.firstChild)
    }
    while (latestRepo.firstChild) {
        latestRepo.removeChild(latestRepo.firstChild)
    }

    const msgTag = document.createElement("h1")
    msgTag.innerText = msg
    userInfoArea.appendChild(msgTag)

    setTimeout(() => {
        userInfoArea.removeChild(msgTag)
    }, 2000)
}
