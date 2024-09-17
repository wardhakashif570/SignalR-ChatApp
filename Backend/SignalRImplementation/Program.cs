var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// Add Swagger service
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();  // Register the Swagger generator

// Add SignalR service
builder.Services.AddSignalR();

// Enable CORS for React frontend on port 3000
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React frontend URL
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // SignalR requires this for WebSockets
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });

    app.UseCors("ReactPolicy");  // Allow CORS only in development
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Map SignalR Hub
app.MapHub<ChatHub>("/chatHub");

app.Run();
