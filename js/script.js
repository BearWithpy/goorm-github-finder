class GitHubFinder {
    constructor() {
        this.API_URL = "https://api.github.com/users/"
        this.accessToken = "token MYTOKEN!!!!"
        this.initElements()
        this.initEventListeners()
    }

    initElements() {
        this.main = document.getElementById("main")
        this.searchBox = document.getElementById("search")
        this.searchBtn = document.getElementById("search-btn")
        this.latestRepo = document.querySelector(".latest-repos-area")
        this.boxSection = document.querySelector(".box-section")
        this.listSection = document.querySelector(".list-section")
        this.leftSection = document.querySelector(".left-section")
        this.contributeArea = document.querySelector(".contribute-area")
        this.loadingScreen = document.querySelector(".loading-screen")
        this.userInfoArea = document.querySelector(".user-info-area")
    }

    initEventListeners() {
        this.searchBtn.addEventListener("click", this.formSubmit.bind(this))
        this.searchBox.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault()
                this.formSubmit()
            }
        })
        this.searchBox.addEventListener("focusout", this.formSubmit.bind(this))
    }

    async getUser(username) {
        try {
            const response = await fetch(this.API_URL + username, {
                headers: {
                    Authorization: this.accessToken,
                },
            })

            this.clearSections()

            if (response.status === 404) {
                this.createErrorCard("No profile with this Username")
                return
            }

            const data = await response.json()
            this.displayUserInfo(data)
            this.getRepos(username)
        } catch (error) {
            console.error(error)
            this.createErrorCard("An error occurred.")
        }
    }

    async getRepos(username) {
        try {
            const response = await fetch(this.API_URL + username + "/repos", {
                headers: {
                    Authorization: this.accessToken,
                },
            })

            if (response.status === 404) {
                this.createErrorCard("No profile with this Username")
                return
            }

            const data = await response.json()
            this.displayRepos(data)
        } catch (error) {
            console.error(error)
            this.createErrorCard("An error occurred.")
        }
    }

    formSubmit() {
        if (this.searchBox.value !== "") {
            this.getUser(this.searchBox.value)
            this.searchBox.value = ""
        }
    }

    clearSections() {
        this.clearSection(this.boxSection)
        this.clearSection(this.listSection)
        this.clearSection(this.leftSection)
        this.clearSection(this.contributeArea)
        this.clearSection(this.latestRepo)
    }

    clearSection(section) {
        while (section.firstChild) {
            section.removeChild(section.firstChild)
        }
    }

    displayUserInfo(data) {
        const imgDiv = document.createElement("div")
        imgDiv.classList.add("user-image")
        const image = document.createElement("img")
        image.src = data.avatar_url
        image.alt = "Alternative text"
        image.width = 230
        image.height = 230

        const viewPage = document.createElement("a")
        viewPage.classList.add("user-image", "item", "view-page-ach")
        viewPage.innerText = "View Page"
        viewPage.href = data.html_url

        const contributeGraph = document.createElement("div")
        contributeGraph.classList.add("contribute-graph-image")
        const graphimage = document.createElement("img")
        graphimage.src = `https://ghchart.rshah.org/${data.login}`
        graphimage.alt = "Graph Alternative text"

        imgDiv.appendChild(image)
        this.leftSection.appendChild(imgDiv)
        this.leftSection.appendChild(viewPage)
        contributeGraph.appendChild(graphimage)
        this.contributeArea.appendChild(contributeGraph)

        const info1 = document.createElement("ul")
        const publicReposDiv = document.createElement("div")
        publicReposDiv.classList.add("item", "ex1")
        const publicGistsDiv = document.createElement("div")
        publicGistsDiv.classList.add("item", "ex2")
        const followersDiv = document.createElement("div")
        followersDiv.classList.add("item", "ex3")
        const followingDiv = document.createElement("div")
        followingDiv.classList.add("item", "ex4")

        const publicRepos = document.createElement("li")
        const publicGists = document.createElement("li")
        const followers = document.createElement("li")
        const following = document.createElement("li")

        publicReposDiv.innerText = `Public Repos: ${data.public_repos}`
        publicRepos.appendChild(publicReposDiv)
        info1.appendChild(publicRepos)

        publicGistsDiv.innerText = `Public Gists: ${data.public_gists}`
        publicGists.appendChild(publicGistsDiv)
        info1.appendChild(publicGists)

        followersDiv.innerText = `Followers: ${data.followers}`
        followers.appendChild(followersDiv)
        info1.appendChild(followers)

        followingDiv.innerText = `Following: ${data.following}`
        following.appendChild(followingDiv)
        info1.appendChild(following)

        this.boxSection.classList.add("item-container")
        this.boxSection.appendChild(info1)

        const info2 = document.createElement("ul")

        const company = document.createElement("li")
        company.style.borderBottom = "1px solid rgb(214, 212, 212)"
        const blog = document.createElement("li")
        blog.style.borderBottom = "1px solid rgb(214, 212, 212)"
        const location = document.createElement("li")
        location.style.borderBottom = "1px solid rgb(214, 212, 212)"
        const createdAt = document.createElement("li")
        createdAt.style.borderBottom = "1px solid rgb(214, 212, 212)"
        company.innerText = `Company: ${
            data.company ? data.company : "No Company"
        }`
        info2.appendChild(company)
        blog.innerText = `Blog/website: ${data.blog ? data.blog : "No Website"}`
        info2.appendChild(blog)

        location.innerText = `Location: ${data.location}`
        info2.appendChild(location)

        const sinceDate = `${data.created_at.slice(
            0,
            10
        )} ${data.created_at.slice(11, 19)}`
        createdAt.innerText = `Since: ${sinceDate}`
        info2.appendChild(createdAt)
        this.listSection.appendChild(info2)

        this.listSection.style.borderTop = "1px solid rgb(214, 212, 212)"
        this.listSection.style.borderLeft = "1px solid rgb(214, 212, 212)"
        this.listSection.style.borderRight = "1px solid rgb(214, 212, 212)"
    }

    displayRepos(data) {
        this.clearSection(this.latestRepo)
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const recentRepos = data.slice(0, 5)

        const ul = document.createElement("ul")
        ul.classList.add("repo-list")

        recentRepos.forEach((item) => {
            const li = document.createElement("li")
            const elem = document.createElement("a")
            elem.classList.add("repo")
            elem.href = item.html_url
            elem.innerText = `${item.name} stars: ${item.stargazers_count} watcher: ${item.watchers_count} forks: ${item.forks_count}`
            elem.target = "_blank"

            li.appendChild(elem)
            ul.appendChild(li)
        })

        this.latestRepo.appendChild(ul)
    }

    createErrorCard(msg) {
        this.clearSections()
        const msgTag = document.createElement("h1")
        msgTag.innerText = msg
        this.leftSection.appendChild(msgTag)

        setTimeout(() => {
            this.leftSection.removeChild(msgTag)
        }, 2000)
    }
}

const gitHubUser = new GitHubFinder()
