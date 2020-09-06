import Foundation
import garrepidev
import HyperSwift

struct Generator {
    public let saveLocation: URL
    public let sidebar = Sidebar()
    
    func generateCssSheet() {
        var stylesheet = CSSStyleSheet.generateStyleSheet()
        stylesheet +=
        """
        @font-face {
            font-family: "SF Mono";
            src: url("/../fonts/SFMono-Regular.otf") format('opentype');
            font-weight: normal;
        }
        @font-face {
            font-family: "SF Mono";
            src: url("/../fonts/SFMono-Bold.otf") format('opentype');
            font-weight: bold;
        }
        
        body {
            font-family: "SF Mono";
        }
        
        .g_sidebar a:hover {
            text-decoration: underline;
        }
        .g_project_card:hover {
            position: relative;
            top: -5px;
            left: -5px;
            box-shadow: 25px 35px 0px 0px rgba(0, 0, 0, 0.6);
        }
        pre {
            overflow: scroll;
        }
        
        @media (min-width: 990px) {
            .g_project_cards { grid-template-columns: repeat(2, 500px); }
        }
        """
        do {
            try stylesheet.write(
                to: saveLocation.appendingPathComponent("css/styles.css"),
                atomically: true,
                encoding: String.Encoding.utf8
            )
        } catch {
            print("[CRITICAL] could not save stylesheet: ", error.localizedDescription)
        }
    }
    
    /**
     Generate top level, common pages.
        - About, 404, 500, etc.
     */
    func generateCommon() {
        savePage(FourOFour(), title: "page not found", "404.html")
        savePage(About(), title: "garreπ | about", "about.html")
        savePage(FiveHundred(), title: "i'm sorry...", "500.html")
    }
    
    func generateBlogs(at folder: URL) {
        guard let blogFiles = try? FileManager.default.contentsOfDirectory(atPath: folder.path) else {
            print("[CRITICAL] could not generate blogs from \(folder.path)")
            return
        }
        let posts = blogFiles.compactMap { Post(from: folder.appendingPathComponent($0), href: $0.replacingOccurrences(of: ".md", with: ".html")) }
        savePage(BlogOverview(posts), title: "garreπ | blogs", "blog.html")
        for post in posts {
            if let page = BlogDetail(with: post) {
                savePage(page, title: post.title, post.href)
            } else {
                print("[ERROR] Could not generate post \(post.title)")
            }
        }
    }
    
    func generateProjects(at folder: URL) {
        guard let projectFiles = try? FileManager.default.contentsOfDirectory(atPath: folder.path) else {
            print("[CRITICAL] could not generate projects from \(folder.path)")
            return
        }
        let projects = projectFiles.compactMap {
            Project(from: folder.appendingPathComponent($0), href: $0.replacingOccurrences(of: ".md", with: ".html"))
        }
        savePage(ProjectsOverview(projects), title: "garreπ | projects", "projects.html")
        for project in projects {
            if let page = ProjectDetail(with: project) {
                savePage(page, title: project.title, project.href)
            } else {
                print("[ERROR] Could not generate project \(project.title)")
            }
        }
    }
    
    private func savePage(_ body: HTMLPage, title: String, _ fileName: String) {
        let head = Head(
            title: title,
            stylesheets: [
                "<link rel=\"stylesheet\" href=\"/css/styles.css\">"
            ]
        )
        let view = HTMLComponent {
            sidebar.render()
            HStack("g_content", justify: .center, wrap: .wrap) {
                body.render()
            }
            .margin(right: 7.5, left: 15, .percent)
        }
        
        let htmlOutput =
        """
        <!DOCTYPE html>
        <html lang="en">
            \(head.render())
            <body style="width: 100%; height: 100%; margin: 0; background-color: #b5b5b5;">
                \(view.render())
            </body>
        </html>
        """
        
        do {
            try htmlOutput.write(
                to: saveLocation.appendingPathComponent(fileName),
                atomically: true,
                encoding: String.Encoding.utf8
            )
            print("saved page \(fileName)\t✓")
        } catch let error as NSError {
            print("[CRITICAL] could not save htmlOutput: ", error.localizedDescription)
        }
    }
}
