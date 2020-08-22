import Foundation

print("Hello, world!")

if let saveLocation = URL(string: "~/dev/johngarrett/html") {
    let generator = Generator(saveLocation: saveLocation)
    generator.generateCommon()
    generator.generateBlogs(from: "./blogs")
    generator.generateProjects(from: "./projects")
} else {
    print("[CRITICAL] invalid save location")
}
