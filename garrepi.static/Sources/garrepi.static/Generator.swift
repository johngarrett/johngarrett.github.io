import Foundation
import garrepidev
import HyperSwift
import garrepidev

struct Generator {
    public let saveLocation: URL
    public let sidebar = Sidebar()
    
    /**
     Generate top level, common pages.
        - About, 404, 500, etc.
     */
    func generateCommon() {
        savePage(FourOFour(), title: "page not found", "404.html")
        savePage(About(), title: "garreπ | about", "about.html")
        savePage(FiveHundred(), title: "i'm sorry...", "500.html")
    }
    
    func generateBlogs(from path: String) {
        
    }
    func generateProjects(from path: String) {
        
    }
    
    private func savePage(_ body: HTMLPage, title: String, _ fileName: String) {
        let head = Head(title: title)
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
        } catch {
            print("[CRITICAL] Unable to save htmlOutput")
        }
        
    }
    
    private static func generate() {
        
    }
}
