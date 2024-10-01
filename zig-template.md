# {repo} Release v{version}

## Updates

{annotation}

## Using it

To use in your own projects, put this dependency into your `build.zig.zon`:

```zig
        // {repo} v{version}
        .{repo} = .{
            .url = "https://github.com/{owner}/{repo}/archive/refs/tags/v{version}.tar.gz",
            .hash = "{hash}",
        }
```

Here is a complete `build.zig.zon` example:

```zig
.{
    .name = "My example project",
    .version = "0.0.1",

    .dependencies = .{
        // {repo} v{version}
        .{repo} = .{
            .url = "https://github.com/{owner}/{repo}/archive/refs/tags/v{version}.tar.gz",
            .hash = "{hash}",
        },
    },
    .paths = .{
        "",
    },
}

```

Then, in your `build.zig`'s `build` function, add the following before
`b.installArtifact(exe)`:

```zig 
    const {repo} = b.dependency("{repo}", .{
        .target = target,
        .optimize = optimize,
    });

    exe.root_module.addImport("{repo}", zap.module("{repo}"));
```
