class GitHubFinder {
    constructor() {
        this.API_URL = "https://api.github.com/users/"
        this.accessToken = "token token MYTOKEN!!!!"
        this.initElements()
        this.initEventListeners()
        this.loadFromLocalStorage()
        this.searchOnLoad()
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

    saveToLocalStorage(username, data) {
        localStorage.setItem("user-name", username)
        localStorage.setItem("user-data", JSON.stringify(data))
    }

    loadFromLocalStorage() {
        const username = localStorage.getItem("user-name")
        const userData = localStorage.getItem("user-data")

        if (username && userData) {
            this.searchBox.value = username
            this.displayUserInfo(JSON.parse(userData))
        }
    }

    searchOnLoad() {
        if (this.searchBox.value) {
            this.getUser(this.searchBox.value)
        }
    }

    async getUser(username) {
        this.clearSections()
        try {
            const response = await fetch(this.API_URL + username, {
                headers: {
                    Authorization: this.accessToken,
                },
            })

            if (response.status === 404) {
                this.createErrorCard("No profile with this Username")
                return
            }

            const data = await response.json()

            this.saveToLocalStorage(username, data)
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

    createElementAndAddClassNameOrNot(tagName, classNames) {
        const element = document.createElement(tagName)
        if (classNames && classNames.length > 0) {
            element.classList.add(...classNames)
        }
        return element
    }

    displayUserInfo(data) {
        const imgDiv = this.createElementAndAddClassNameOrNot("div", [
            "user-image",
        ])
        const image = document.createElement("img")
        image.src = data.avatar_url
        image.alt = "Alternative text"

        const viewPage = this.createElementAndAddClassNameOrNot("a", [
            "user-image",
            "item",
            "view-page-ach",
        ])
        viewPage.innerText = "View Page"
        viewPage.href = data.html_url

        const contributeGraph = this.createElementAndAddClassNameOrNot("div", [
            "contribute-graph-image",
        ])
        const graphimage = document.createElement("img")
        graphimage.src = `https://ghchart.rshah.org/${data.login}`
        graphimage.alt = "Graph Alternative text"

        imgDiv.appendChild(image)
        this.leftSection.appendChild(imgDiv)
        this.leftSection.appendChild(viewPage)
        contributeGraph.appendChild(graphimage)
        this.contributeArea.appendChild(contributeGraph)

        const info1 = document.createElement("ul")
        const publicReposDiv = this.createElementAndAddClassNameOrNot("div", [
            "item",
            "ex1",
        ])
        const publicGistsDiv = this.createElementAndAddClassNameOrNot("div", [
            "item",
            "ex2",
        ])
        const followersDiv = this.createElementAndAddClassNameOrNot("div", [
            "item",
            "ex3",
        ])
        const followingDiv = this.createElementAndAddClassNameOrNot("div", [
            "item",
            "ex4",
        ])

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

        const info2 = this.createElementAndAddClassNameOrNot("ul", [
            "table-list-info",
        ])

        const company = document.createElement("li")
        const blog = document.createElement("li")
        const location = document.createElement("li")
        const createdAt = document.createElement("li")

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
    }

    displayRepos(data) {
        this.clearSection(this.latestRepo)
        data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        const recentRepos = data.slice(0, 5)

        const ul = this.createElementAndAddClassNameOrNot("ul", ["repo-list"])

        recentRepos.forEach((item) => {
            const li = document.createElement("li")

            const repoLink = document.createElement("a")
            repoLink.href = item.html_url
            repoLink.target = "_blank"

            const repoInfoContainer = this.createElementAndAddClassNameOrNot(
                "div",
                ["repo-info"]
            )

            const visibilityIcon = this.createElementAndAddClassNameOrNot(
                "div",
                ["material-icons", "vis"]
            )
            visibilityIcon.innerText = `visibility`

            const watchersCount = document.createElement("span")
            watchersCount.innerText = `  ${item.watchers_count}  `

            const gradeIcon = this.createElementAndAddClassNameOrNot("div", [
                "material-icons",
                "star",
            ])
            gradeIcon.innerText = `grade`

            const stargazersCount = document.createElement("span")
            stargazersCount.innerText = `  ${item.stargazers_count}  `

            const svgCode = `
<svg
    fill="#ffffff"

    viewBox="0 0 256 256"
    id="Flat"
    xmlns="http://www.w3.org/2000/svg"
>
    <path
        d="M228,67.99756A40,40,0,1,0,175.80518,106.09a12.01092,12.01092,0,0,1-11.8042,9.908l-72,.00146a11.98274,11.98274,0,0,1-11.81006-9.9082,39.99048,39.99048,0,1,0-24.11914.08911A35.98846,35.98846,0,0,0,92.001,139.99951l24.001-.00049-.001,9.84223a40,40,0,1,0,24,.00061l.001-9.84332,23.999-.00049a36.042,36.042,0,0,0,35.92675-33.81745A40.07133,40.07133,0,0,0,228,67.99756Zm-160-16a16,16,0,1,1-16,16A16.01833,16.01833,0,0,1,68,51.99756ZM128,204a16,16,0,1,1,16-16A16.01833,16.01833,0,0,1,128,204ZM188,83.99756a16,16,0,1,1,16-16A16.01833,16.01833,0,0,1,188,83.99756Z"
    />
</svg>`

            const parser = new DOMParser()
            const forkIcon = parser
                .parseFromString(svgCode, "image/svg+xml")
                .querySelector("svg")
            forkIcon.classList.add("fork", "star")

            const forkCount = document.createElement("span")
            forkCount.innerText = `  ${item.forks_count}`

            const repoName = this.createElementAndAddClassNameOrNot("div", [
                "repo-name",
            ])
            repoName.innerText = item.name

            repoInfoContainer.appendChild(visibilityIcon)
            repoInfoContainer.appendChild(watchersCount)
            repoInfoContainer.appendChild(gradeIcon)
            repoInfoContainer.appendChild(stargazersCount)
            repoInfoContainer.appendChild(forkIcon)
            repoInfoContainer.appendChild(forkCount)

            repoLink.appendChild(repoInfoContainer)
            repoLink.appendChild(repoName)

            li.appendChild(repoLink)
            li.addEventListener("click", () => {
                window.location.href = repoLink.href
            })
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
