param([ValidateSet('orange', 'watermelon', 'lime')][string]$Flavor)
$ErrorActionPreference = 'Stop'
$references = @{
  orange = 'D:/higgsfield/75116d1a-1477-43d9-b7b2-c7ad4c848ef2.png'
  watermelon = 'D:/higgsfield/31f290e6-2970-4272-84f5-c87a77c55175.png'
  lime = 'D:/higgsfield/c8fc88e0-0f74-4a34-83d2-791ab3a23502.png'
}
$subjects = @{
  orange = '1: full circular orange cross-section, face nearly frontal. 2: whole oval orange with tiny green stem, three-quarter view. 3: orange semicircular wedge with cut face visible. 4: another full circular orange slice with slight perspective. 5: orange semicircular wedge tilted diagonally. 6: small whole orange with tiny stem.'
  watermelon = '1: triangular watermelon wedge with rind on its left edge. 2: circular watermelon cross-section. 3: triangular watermelon wedge with rind along bottom curved edge. 4: triangular watermelon wedge pointing down-left. 5: thick quarter-circle watermelon wedge with visible rind. 6: small circular watermelon cross-section. All pieces have vivid red wet flesh, natural black seeds, thin white pith and dark green striped rind.'
  lime = '1: full circular lime cross-section, face nearly frontal. 2: whole oval deep green lime with tiny stem, three-quarter view. 3: lime semicircular wedge with cut face visible. 4: another full circular lime slice with slight perspective. 5: lime semicircular wedge tilted diagonally. 6: small whole lime with tiny stem. Lime flesh is vivid yellow-green, rind rich dark green.'
}
$prompt = @"
Create a professional photographic asset sheet of exactly SIX separate $Flavor fruit cutouts inspired by the fruit in the reference advertisement. Output landscape 3:2. Strict invisible grid: THREE equal columns and TWO equal rows; one object centered in each cell. Each object fits entirely within the central 70 percent of its cell, with generous clear gaps. Read cells left-to-right, top-to-bottom: $($subjects[$Flavor])
Reproduce the reference's fresh realistic fruit texture, juicy translucent flesh, detailed peel, soft studio lighting from upper left, glossy advertising photography. Each is an independent floating object, fully reconstructed, no cropping. Flat solid white background, no cast shadows, no surface, no grid lines, no labels, no typography, no cup, no hand, no liquid splashes, no other objects. Do not reproduce the page composition. This is a clean evenly spaced SIX-object sprite sheet for separate transparent web assets.
"@
$directory = "artifacts/fruits/$Flavor"
New-Item -ItemType Directory -Force -Path $directory | Out-Null
$inputs = @{ prompt = $prompt; images = @("@$($references[$Flavor])"); aspect_ratio = '3:2'; resolution = '2k'; output_format = 'png' }
$inputs | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath "$directory/input.json"
pnpm dlx @wavespeed/cli run bytedance/seedream-v5.0-pro/edit --input-file "$directory/input.json" --json --download "$directory/sheet.png" | Set-Content -LiteralPath "$directory/generation.json"
if ($LASTEXITCODE -ne 0) { throw 'WaveSpeed generation failed' }
Write-Output "$Flavor sheet generated"
@{ image = "@./$directory/sheet.png" } | ConvertTo-Json | Set-Content -LiteralPath "$directory/remove-input.json"
pnpm dlx @wavespeed/cli run wavespeed-ai/image-background-remover --input-file "$directory/remove-input.json" --json --download "$directory/transparent.png" | Set-Content -LiteralPath "$directory/removal.json"
if ($LASTEXITCODE -ne 0) { throw 'WaveSpeed background removal failed' }
Write-Output "$Flavor transparent sheet saved"
