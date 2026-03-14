import { ThermalPrinter, PrinterTypes } from "node-thermal-printer";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const printReceipt = async (req, res) => {
  const { items, total } = req.body;

  let printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: "file:./receipt.bin", 
    removeSpecialCharacters: false,
    lineCharacter: "=",
  });

  try {
    console.log("Generating receipt data...");

    printer.alignCenter();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.println("QUICK SCAN POS");
    printer.setTextNormal();
    printer.bold(false);
    printer.println("Biougra, Morocco");
    printer.println("Tel: 0689946687");
    printer.newLine();
    
    printer.alignLeft();
    printer.println(`Date: ${new Date().toLocaleString()}`);
    printer.drawLine();

    // items table header
    printer.tableCustom([
      { text: "Product", align: "LEFT", width: 0.6 },
      { text: "Qty", align: "CENTER", width: 0.1 },
      { text: "Price", align: "RIGHT", width: 0.3 }
    ]);
    printer.drawLine();

    // items
    items.forEach((item) => {
      printer.tableCustom([
        { text: item.name, align: "LEFT", width: 0.6 },
        { text: item.qty.toString(), align: "CENTER", width: 0.1 },
        { text: `${item.price} DH`, align: "RIGHT", width: 0.3 }
      ]);
    });

    printer.drawLine();
    printer.alignRight();
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println(`TOTAL: ${total} DH`);
    printer.setTextNormal();
    printer.bold(false);
    
    printer.newLine();
    printer.alignCenter();
    printer.println("Merci pour votre visite!");
    printer.println("A bientot!");
    
    printer.cut();

    // 1. Save buffer to file
    const buffer = printer.getBuffer();
    const filePath = path.join(process.cwd(), "receipt.bin");
    fs.writeFileSync(filePath, buffer);

    // 2. Send Raw binary file to the printer
    const shareName = "\\\\localhost\\POS80";  
    console.log(`Sending raw binary to shared printer: ${shareName}`);
    
    // Command to send raw binary file without any processing
    const command = `cmd /c copy /b "${filePath}" "${shareName}"`;
    
    await execAsync(command);

    // Cleanup
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Printed successfully" });
  } catch (error) {
    console.error("Printer Error:", error);
    res.status(500).json({ error: "Printer Error", details: error.message });
  }
};

