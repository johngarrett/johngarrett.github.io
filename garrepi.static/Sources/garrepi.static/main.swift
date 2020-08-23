import Foundation

let saveLocation = URL(fileURLWithPath: "/Users/garrepi/dev/johngarrett.github.io")
let generator = Generator(saveLocation: saveLocation)

generator.generateCommon()
generator.generateBlogs(at: URL(fileURLWithPath: "/Users/garrepi/dev/johngarrett.github.io/blog-posts"))
generator.generateProjects(at: URL(fileURLWithPath: "/Users/garrepi/dev/johngarrett.github.io/project-posts"))
generator.generateCssSheet()
